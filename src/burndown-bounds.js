import * as d3 from "d3";
import {work_day} from "./burndown-utils";

function bound_days(all_dates, bank_holidays, range) {
  var data = [],
      index = 0;

  var working_day_count = all_dates.filter(date => work_day(date, bank_holidays)).length;

  var scale = d3.scaleLinear().range(range).domain([0, working_day_count]);

  all_dates.forEach(function(date) {
    data.push({ date: date, index: index, days: scale(index) });
    if (work_day(date, bank_holidays)) ++index;
  });

  return data;
}

function drawBounds(g, all_dates, bank_holidays, line) {
  g.append("path")
      .datum(bound_days(all_dates, bank_holidays, [27, 0]))
      .attr("class", "line guide")
      .attr("d", line);

  g.append("path")
      .datum(bound_days(all_dates, bank_holidays, [38, 5]))
      .attr("class", "line guide")
      .attr("d", line);
}

export {drawBounds};
