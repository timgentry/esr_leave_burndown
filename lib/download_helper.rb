# This mixin helps monitor and manage downloads
module DownloadHelper
  DOWNLOAD_TIMEOUT = 10
  DOWNLOAD_PATH = File.expand_path('../../tmp', __FILE__)

  def downloads
    Dir[File.join(DOWNLOAD_PATH, '*')]
  end

  def download
    downloads.first
  end

  def download_content
    wait_for_download
    File.read(download)
  end

  def wait_for_download
    Timeout.timeout(DOWNLOAD_TIMEOUT) do
      sleep 0.1 until downloaded?
    end
    sleep 1
  end

  def downloaded?
    !downloading? && downloads.any?
  end

  def downloading?
    downloads.grep(/\.crdownload$/).any?
  end

  def clear_downloads
    FileUtils.rm_f(downloads)
  end
end
