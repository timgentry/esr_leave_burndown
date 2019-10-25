# Simple class to store annual leave
class AnnualLeave
  attr_reader :start_date, :end_date, :hours

  def initialize(start_date, end_date, hours)
    @start_date = start_date
    @end_date = end_date
    @hours = hours
  end

  def between?(date)
    date >= @start_date && date <= @end_date
  end

  def days
    (@end_date - @start_date).to_i + 1
  end

  def hours_per_day
    @hours / days
  end
end
