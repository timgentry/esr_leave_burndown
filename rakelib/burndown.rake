desc 'burndown'
task :burndown do
  # Usage: bundle exec rake burndown
  require 'chronic'
  require 'csv'
  require 'date'
  require 'shellwords'
  require 'yaml'
  require_relative '../lib/annual_leave'
  require_relative '../lib/download_helper'
  require_relative '../lib/format_helper'

  include FormatHelper

  BANK_HOLIDAYS = [
    Date.new(2018, 8, 27),
    Date.new(2018, 12, 25),
    Date.new(2018, 12, 26),
    Date.new(2019, 1, 1),
    Date.new(2019, 4, 19),
    Date.new(2019, 4, 22),
    Date.new(2019, 5, 6),
    Date.new(2019, 5, 27),
    Date.new(2019, 8, 26),
    Date.new(2019, 12, 25),
    Date.new(2019, 12, 26),
    Date.new(2020, 1, 1),
    Date.new(2020, 4, 10),
    Date.new(2020, 4, 13),
  ].freeze

  workdays = 0
  Date.new(2019, 4, 1).upto(Date.new(2020, 3, 31)).each do |date|
    # require 'pry';binding.pry
    next if date.strftime('%u').to_i > 5
    next if BANK_HOLIDAYS.include?(date)

    workdays += 1
    # puts [date, date.strftime('%A'), date.strftime('%u')].inspect
  end

  all_staff = YAML.load_file('staff.yml')

  total_net_accrual = all_staff.map { |hash| hash['net_accrual'] }.compact.reduce(0, :+)

  all_staff_leave_hash = {}
  all_staff.each do |staff_member|
    assignment_number = staff_member['assignment_number']
    all_staff_leave_hash[assignment_number] = []

    filename = Shellwords.escape("#{assignment_number}.csv")
    path = File.join(DownloadHelper::DOWNLOAD_PATH, filename)
    next unless File.exist?(path)

    CSV.read(path).each do |line|
      next if line.empty?
      next unless 'Annual Leave' == line[3]

      start_date = Chronic.parse(line[0]).to_date
      end_date = Chronic.parse(line[1]).to_date
      # Absence Type
      # Absence Category
      # Days
      hours = line[5].to_f
      # Approval Status

      next unless end_date >= Date.new(2019, 4, 1) && end_date < Date.new(2020, 4, 1)

      annual_leave = AnnualLeave.new(start_date, end_date, hours)
      all_staff_leave_hash[assignment_number] << annual_leave
    end
  end

  # puts all_staff_leave_hash.inspect

  # next

  CSV.open('dist/leave.csv', 'w', force_quotes: true) do |csv|
    row = ['date']

    all_staff.each do |hash|
      row << format_name(hash['name'])
    end

    csv << row
    Date.new(2019, 4, 1).upto(Date.new(2020, 3, 31)).each do |date|
      row = [date.strftime('%Y-%m-%d')]

      all_staff.each do |hash|
        assignment_number = hash['assignment_number']
        annual_leaves = all_staff_leave_hash[assignment_number]
        max_leave_date = annual_leaves.map(&:end_date).push(Date.today).sort.last
        row << (date <= max_leave_date ? hash['gross_accrual'] : nil)
        # row << hash['gross_accrual']

        # puts assignment_number
        # puts annual_leaves.inspect
        annual_leaves.each do |annual_leave|
          if annual_leave.between?(date)
            hash['gross_accrual'] = hash['gross_accrual'] - annual_leave.hours_per_day
          end
        end
      end
      # require 'pry';binding.pry
      # # puts [date, date.strftime('%A'), date.strftime('%u')].inspect
      # puts "\"#{date == Date.today ? total_net_accrual : ''}\""

      csv << row
    end
  end
end

desc 'Unused leave'
task :unused_leave do
  require 'yaml'
  require_relative '../lib/format_helper'

  include FormatHelper

  all_staff = YAML.load_file('staff.yml')
  all_staff.each do |hash|
    net_accrual = hash['net_accrual']
    next if net_accrual.nil? || net_accrual <= 37.5

    name = format_name(hash['name'])
    initials = name.split(' ').map { |word| word[0, 1] }.join
    excess = (net_accrual - 37.5) / 7.5

    puts "#{initials}: #{net_accrual} hrs (#{excess} days over 5 day carry over limit)"
  end
end
