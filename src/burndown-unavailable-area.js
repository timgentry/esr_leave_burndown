import * as d3 from 'd3'
import { workDay } from './burndown-utils'

function unavailableArea (x, y) {
  return d3.area()
    .x(d => x(d.date))
    .y0(y(0))
    .y1(d => y(d.days))
}

function unavailableDays (allDates, bankHolidays) {
  var totalUnavailableDays = 27
  var data = []
  allDates.forEach(function (date) {
    if (totalUnavailableDays < 0) return false

    data.push({ date: date, days: totalUnavailableDays })
    if (workDay(date, bankHolidays)) --totalUnavailableDays
  })

  return data
}

function drawUnavailableArea (g, allDates, bankHolidays, x, y) {
  g.append('path')
    .datum(unavailableDays(allDates, bankHolidays))
    .attr('class', 'unavailable')
    .attr('d', unavailableArea(x, y))
}

export { drawUnavailableArea }
