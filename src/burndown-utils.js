function work_day(date, bank_holidays){
  var day_of_week = date.getDay();
  return day_of_week > 0 && day_of_week < 6 && !bank_holidays.includes(date);
}

export {work_day};
