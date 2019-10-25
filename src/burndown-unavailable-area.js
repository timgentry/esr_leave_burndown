import * as d3 from "d3";
import {work_day} from "./burndown-utils";

function unavailable_area(x, y) {
  return d3.area()
    .x(d => x(d.date))
    .y0(y(0))
    .y1(d => y(d.days));
}

function unavailable_days(all_dates, bank_holidays) {
  var total_unavailable_days = 27;
  var data = [];
  all_dates.forEach(function(date) {
    if (total_unavailable_days < 0) return false;

    data.push({ date: date, days: total_unavailable_days });
    if (work_day(date, bank_holidays)) --total_unavailable_days;
  });

  return data;
}

function drawUnavailableArea(g, all_dates, bank_holidays, x, y) {
  g.append("path")
      .datum(unavailable_days(all_dates, bank_holidays))
      .attr("class", "unavailable")
      .attr("d", unavailable_area(x, y));
}

export {drawUnavailableArea};
