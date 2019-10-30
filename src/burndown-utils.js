function workDay (date, bankHolidays) {
  var dayOfWeek = date.getDay()
  return dayOfWeek > 0 && dayOfWeek < 6 && !bankHolidays.includes(date)
}

export { workDay }
