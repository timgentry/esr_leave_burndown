namespace :scrape do
  desc 'Scrape ESR'
  task :esr do
    # Usage: bundle exec rake scrape:esr
    require_relative '../lib/esr'
    require 'highline/import'

    # TODO: Use https://github.com/ahoward/sekrets

    begin
      username  = ENV['ESR_USERNAME'] || ask('ESR Username: ')
      password  = ask('ESR Password: ') { |q| q.echo = false }
      esr = Esr.new(username, password)

      esr.find_staff_with_absences
    ensure
      esr.log_out
      # sleep 5

      # puts ":( no login found, possibly something's broken"
      # exit(-1)
    end
  end
end
