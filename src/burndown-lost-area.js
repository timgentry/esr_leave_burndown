import * as d3 from 'd3'
import { workDay } from './burndown-utils'

function lostArea (x, y) {
  return d3.area()
    .x(d => x(d.date))
    .y0(0)
    .y1(d => y(d.days))
}

function lostHours (allDates, bankHolidays, maxDays) {
  var carryOverDays = 5
  var data = []

  var j = allDates.length
  while (j--) {
    if (carryOverDays > maxDays) break

    var date = allDates[j]
    data.push({ date: date, days: carryOverDays })

    if (workDay(date, bankHolidays)) ++carryOverDays
  }

  return data
}

function drawLostArea (g, allDates, bankHolidays, maxDays, x, y) {
  // var maxDays = y.domain()[1];
  g.append('path')
    .datum(lostHours(allDates, bankHolidays, maxDays))
    .attr('class', 'lost')
    .attr('d', lostArea(x, y))
}

export { drawLostArea }
