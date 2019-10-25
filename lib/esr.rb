require 'capybara/dsl'
require 'selenium/webdriver'
require 'yaml'
require 'shellwords'
require 'pry'
require_relative 'download_helper'
require_relative 'register_drivers'

# This class manages control and parsing of ESR
class Esr
  include Capybara::DSL
  include DownloadHelper

  OAHOMEPAGE_URL = 'https://my.esr.nhs.uk/OA_HTML/OA.jsp?OAFunc=OAHOMEPAGE&PortalReturn=false'.freeze

  attr_reader :username, :password

  def initialize(username, password)
    @username = username
    @password = password

    @logged_in = false
    Capybara.default_driver = :chrome

    clear_downloads
  end

  def visit(path)
    super

    return unless page.has_content?('Log in with your credentials')

    fill_in 'Username*', with: username
    fill_in 'Password*', with: password
    click_button 'Log in via Username Password'

    raise 'Login failed' if page.has_content?('Login Failed.')

    @logged_in = true
  end

  # def log_in
  #   visit 'https://my.esr.nhs.uk/dashboard/c/portal/login'
  #
  #   return false unless page.has_content?('Log in with your credentials')
  # end

  def expand_links
    loop do
      page.first('img[title="Select to expand"]').click
    end
  rescue Capybara::ElementNotFound
  end

  def visit_absences
    return if @absences_url && @absences_url == current_url

    if @absences_url && @absences_url != current_url
      visit @absences_url
    else
      visit OAHOMEPAGE_URL
      unless page.has_content?('Supervisor Self Service')
        # post login redirect didn't work, trying again
        visit OAHOMEPAGE_URL
      end

      click_link '919 Supervisor Self Service (Limited Access)'
      click_link 'Absence'

      raise 'Failed to visit Absences' unless page.has_content?('Absence: People in Hierarchy')

      @absences_url = current_url
    end
  end

  def visit_own_absences
    return if @own_absences_url && @own_absences_url == current_url

    if @own_absences_url && @own_absences_url != current_url
      visit @own_absences_url
    else
      visit OAHOMEPAGE_URL
      unless page.has_content?('919 Employee Self Service')
        # post login redirect didn't work, trying again
        visit OAHOMEPAGE_URL
      end

      click_link '919 Employee Self Service'
      click_link 'Absence Summary'

      raise 'Failed to visit your absences' unless page.has_content?('Absence Summary: Summary')

      @own_absences_url = current_url
    end
  end

  def each_absence_row
    return enum_for(:each_absence_row) unless block_given?

    page.all('table.xcg tr').each do |tr|
      # urls << a[:href]
      tds = tr.all('td')
      next if tds.empty?
      next if tds[1].nil? || tds[1].text == ''

      yield tds
    end
  end

  def find_staff_with_absences
    staff = []

    staff << find_own_absenses

    visit_absences
    expand_links

    # visit_absences
    total_rows = each_absence_row.count
    raise 'No absense rows found' if total_rows.zero?

    total_rows.times do |table_row|
      each_absence_row.with_index do |tds, i|
        next unless table_row == i

        assignment_number = tds[2].text
        hash = { 'assignment_number' => assignment_number, 'index' => i,
                 'name' => tds[1].text, 'parent_index' => parent_index(tds, i) }

        unless tds[2].text.empty?
          tds[5].find(:xpath, './/a/img[@title="Action"]/..').click

          if 'No results found.' == page.first('td.x50').text
            FileUtils.rm Shellwords.escape("#{assignment_number}.csv"), force: true
          else
            click_on 'Export Absences'
            wait_for_download
            FileUtils.cd(DownloadHelper::DOWNLOAD_PATH) do
              FileUtils.mv 'export.csv', Shellwords.escape("#{assignment_number}.csv")
            end
          end

          click_on 'Entitlement Balances'
          stats = all('#entitlementBalances table').last.text.split("\n")
          if ['No Accrual Balances Found'] == stats
            # TODO
          else
            hash['gross_accrual'] = stats[1].match(/Gross Accrual (\d+(?:\.\d+)?)/)[1].to_f
            hash['net_accrual'] = stats[2].match(/Net Accrual (\d+(?:\.\d+)?)/)[1].to_f
          end
        end

        staff << hash unless i.zero?
        break
      end

      if table_row < total_rows
        visit_absences
        expand_links
      end
    end

    # save_and_open_page
    File.open('staff.yml', 'w') do |file|
      YAML.dump(staff, file)
    end
  end

  def find_own_absenses
    visit_own_absences

    name = all('#PersonSummaryRN tr').
           select { |tr| tr.all('td')[1].text == 'Employee Name' }.
           map { |tr| tr.all('td')[3].text }.first
    assignment_number = all('#PersonSummaryRN tr').
                        select { |tr| tr.all('td')[1].text == 'Employee Number' }.
                        map { |tr| tr.all('td')[3].text }.first

    hash = { 'assignment_number' => assignment_number, 'index' => 0,
             'name' => name, 'parent_index' => nil }

    click_on 'Export Absences'
    wait_for_download
    FileUtils.cd(DownloadHelper::DOWNLOAD_PATH) do
      FileUtils.mv 'export.csv', Shellwords.escape("#{assignment_number}.csv")
    end

    click_on 'Entitlement Balances'
    stats = all('#entitlementBalances table').last.text.split("\n")
    hash['gross_accrual'] = stats[1].match(/Gross Accrual (\d+(?:\.\d+)?)/)[1].to_f
    hash['net_accrual'] = stats[2].match(/Net Accrual (\d+(?:\.\d+)?)/)[1].to_f

    hash
  end

  def log_out
    visit 'https://my.esr.nhs.uk/dashboard/c/portal/logout'

    @logged_in = false
    page.has_content?('Successfully logged out')
  end

  private

  # This returns the left margin of the name, compensating for the + icon of staff with
  # line management
  def margin_left(tds)
    first_div = tds[1].first('div')
    margin_left = first_div.style('margin-left')['margin-left'].sub(/px\z/, '').to_i
    margin_left += 24 if first_div.has_link?
    margin_left
  end

  def margin_to_tree_depth(margin)
    @margin_levels ||= []
    @margin_levels << margin unless @margin_levels.include?(margin)
    @margin_levels.index(margin)
  end

  def parent_index(tds, i)
    @ancestors ||= []
    margin = margin_left(tds)
    depth = margin_to_tree_depth(margin)
    @ancestors[depth] = i
    @ancestors[0, depth].last
  end
end
