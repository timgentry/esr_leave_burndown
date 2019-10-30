import * as d3 from 'd3'

var parseTime = d3.timeParse('%Y-%m-%d')

function transformLeave (data) {
  return new Promise(function (resolve, reject) {
    var allDates = data.map(d => d.date)

    var people = data.columns.slice(2).map(function (id) {
      var values = data.filter(function (d) { return d[id] !== '' }).map(function (d) {
        var days = +d[id] / 7.5
        return { date: d.date, days: days }
      })
      return {
        id: id,
        values: values
      }
    })

    resolve([data, allDates, people])
  })
}

function getLeave () {
  return d3.tsv('leave.csv', function (d) {
    d.date = parseTime(d.date)
    return d
  }).then(transformLeave)
}

export { getLeave }
