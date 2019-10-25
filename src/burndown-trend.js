function getTrend(people, all_dates) {
  var daily_total = {};
  for (let person of people) {
    var days = 0;
    var last_days = 0;
    all_dates.forEach(function(date) {
      daily_total[date] || (daily_total[date] = 0);
      // console.log(person.values);
      let date_entry = person.values.find(function(d){ return d.date == date; });
      if (typeof date_entry == "undefined") {
        days = last_days;
      } else {
        days = date_entry.days;
        last_days = days;
      }
      daily_total[date] += days;
    });
  }

  // Calculate the latest date of booked leave
  let last_date = all_dates[0];
  for (let person of people) {
    let leave_dates = person.values.map(function(d){ return d.date; });
    let last_leave_date = new Date(Math.max.apply(null, leave_dates));
    if (last_leave_date > last_date) last_date = last_leave_date;
  }

  var trend = [];
  for (let date in daily_total) {
    var total_days = daily_total[date];
    if (new Date(date) < last_date) trend.push({date: new Date(date), days: total_days / people.length});
  }
  return trend;
}

function drawPastTrend(g, people, all_dates, line) {
  var trend = getTrend(people, all_dates);

  g.append("path")
      .datum(trend)
      .attr("class", "line trend bg")
      .attr("d", function(d) { return line(d.filter(function(d){
        return d.date <= new Date();
      })); })
      ;
  g.append("path")
      .datum(trend)
      .attr("class", "line trend")
      .attr("d", function(d) { return line(d.filter(function(d){
        return d.date <= new Date();
      })); })
      ;
}

function drawFutureTrend(g, people, all_dates, line) {
  var trend = getTrend(people, all_dates);

  g.append("path")
      .datum(trend)
      .attr("class", "line planned trend bg")
      .attr("d", function(d) { return line(d.filter(function(d){
        return d.date > new Date();
      })); })
      ;
  g.append("path")
      .datum(trend)
      .attr("class", "line planned trend")
      .attr("d", function(d) { return line(d.filter(function(d){
        return d.date > new Date();
      })); })
      ;
}

export {drawPastTrend, drawFutureTrend};
