import * as d3 from "d3";
import {work_day} from "./burndown-utils";

function lost_area(x, y){
  return d3.area()
    .x(d => x(d.date))
    .y0(0)
    .y1(d => y(d.days));
}

function lost_hours(all_dates, bank_holidays, max_days) {
  var carry_over_days = 5;
  var data = [];

  var j = all_dates.length;
  while (j--) {
    if (carry_over_days > max_days) break;

    var date = all_dates[j];
    data.push({ date: date, days: carry_over_days });

    if (work_day(date, bank_holidays)) ++carry_over_days;
  }

  return data;
}

function drawLostArea(g, all_dates, bank_holidays, max_days, x, y) {
  // var max_days = y.domain()[1];
  g.append("path")
    .datum(lost_hours(all_dates, bank_holidays, max_days))
    .attr("class", "lost")
    .attr("d", lost_area(x, y));
}

export {drawLostArea};
