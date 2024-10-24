module TimeFormatter
  extend ActiveSupport::Concern

  included do
    def am_pm_to_iso(am_pm_notation_format)
      Time.parse(am_pm_notation_format)
    end

    def iso_to_am_pm(timestamp)
      timestamp.strftime("%I:%M %p")
    end

    def iso_to_unix(iso_format_time)
      iso_format_time.to_i
    end

    def unix_to_minutes(unix_time)
      unix_time / 60
    end

    def unix_to_iso(unix_time)
      Time.at(unix_time)
    end

    def unix_to_am_pm(unix_time)
      iso_to_am_pm(unix_to_iso(unix_time))
    end

    def am_pm_to_unix(am_pm_notation)
      iso_to_unix(am_pm_to_iso(am_pm_notation))
    end
  end
end
