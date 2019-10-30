import * as d3 from 'd3'
import { workDay } from './burndown-utils'

function boundDays (allDates, bankHolidays, range) {
  var data = []
  var index = 0

  var workingDayCount = allDates.filter(date => workDay(date, bankHolidays)).length

  var scale = d3.scaleLinear().range(range).domain([0, workingDayCount])

  allDates.forEach(function (date) {
    data.push({ date: date, index: index, days: scale(index) })
    if (workDay(date, bankHolidays)) ++index
  })

  return data
}

function drawBounds (g, allDates, bankHolidays, line) {
  g.append('path')
    .datum(boundDays(allDates, bankHolidays, [27, 0]))
    .attr('class', 'line guide')
    .attr('d', line)

  g.append('path')
    .datum(boundDays(allDates, bankHolidays, [38, 5]))
    .attr('class', 'line guide')
    .attr('d', line)
}

export { drawBounds }
