Capybara.register_driver :chrome do |app|
  profile = Selenium::WebDriver::Chrome::Profile.new
  profile['download.default_directory'] = DownloadHelper::DOWNLOAD_PATH
  Capybara::Selenium::Driver.new(app, browser: :chrome, profile: profile)
end

Capybara.register_driver :headless_chrome do |app|
  capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
    chromeOptions: { args: %w[headless disable-gpu] }
  )

  Capybara::Selenium::Driver.new app,
                                 browser: :chrome,
                                 desired_capabilities: capabilities
end
