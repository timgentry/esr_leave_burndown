function getTrend (people, allDates) {
  var dailyTotal = {}
  for (const person of people) {
    var days = 0
    var lastDays = 0
    allDates.forEach(function (date) {
      dailyTotal[date] || (dailyTotal[date] = 0)
      // console.log(person.values);
      const dateEntry = person.values.find(function (d) { return d.date === date })
      if (typeof dateEntry === 'undefined') {
        days = lastDays
      } else {
        days = dateEntry.days
        lastDays = days
      }
      dailyTotal[date] += days
    })
  }

  // Calculate the latest date of booked leave
  let lastDate = allDates[0]
  for (const person of people) {
    const leaveDates = person.values.map(function (d) { return d.date })
    const lastLeaveDate = new Date(Math.max.apply(null, leaveDates))
    if (lastLeaveDate > lastDate) lastDate = lastLeaveDate
  }

  var trend = []
  for (const date in dailyTotal) {
    var totalDays = dailyTotal[date]
    if (new Date(date) < lastDate) trend.push({ date: new Date(date), days: totalDays / people.length })
  }
  return trend
}

function drawPastTrend (g, people, allDates, line) {
  var trend = getTrend(people, allDates)

  g.append('path')
    .datum(trend)
    .attr('class', 'line trend bg')
    .attr('d', function (d) {
      return line(d.filter(function (d) {
        return d.date <= new Date()
      }))
    })

  g.append('path')
    .datum(trend)
    .attr('class', 'line trend')
    .attr('d', function (d) {
      return line(d.filter(function (d) {
        return d.date <= new Date()
      }))
    })
}

function drawFutureTrend (g, people, allDates, line) {
  var trend = getTrend(people, allDates)

  g.append('path')
    .datum(trend)
    .attr('class', 'line planned trend bg')
    .attr('d', function (d) {
      return line(d.filter(function (d) {
        return d.date > new Date()
      }))
    })

  g.append('path')
    .datum(trend)
    .attr('class', 'line planned trend')
    .attr('d', function (d) {
      return line(d.filter(function (d) {
        return d.date > new Date()
      }))
    })
}

export { drawPastTrend, drawFutureTrend }
