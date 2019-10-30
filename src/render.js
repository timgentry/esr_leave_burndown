import * as d3 from 'd3'

var svg = d3.select('svg')
var margin = { top: 20, right: 20, bottom: 30, left: 50 }
var width = +svg.attr('width') - margin.left - margin.right
var height = +svg.attr('height') - margin.top - margin.bottom
var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var x = d3.scaleTime()
  .rangeRound([0, width])

var y = d3.scaleLinear()
  .rangeRound([height, 0])

var z = d3.scaleOrdinal(d3.schemeCategory10)

var line = d3.line()
// .curve(d3.curveBasis)
  .x(function (d) { return x(d.date) })
  .y(function (d) { return y(d.days) })

export { svg, margin, width, height, g, x, y, z, line }
