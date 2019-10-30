import * as d3 from 'd3'
// import {axisBottom, axisLeft} from "d3-axis";
// import {timeYear} from "d3-time";
// import {timeFormat} from "d3-time-format";

function drawAxes (g, height, x, y) {
  g.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x).tickFormat(function (date) {
      if (d3.timeYear(date) < date) {
        return d3.timeFormat('%B')(date)
      } else {
        return d3.timeFormat('%Y')(date)
      }
    }))

  g.append('g')
    .call(d3.axisLeft(y))
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '-3.71em')
    .attr('text-anchor', 'end')
    .text('Leave (Days)')
}

export { drawAxes }
