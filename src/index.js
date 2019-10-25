import * as d3 from "d3";
import {getBankHolidays} from "./get-bank-holidays";
import {getLeave} from "./get-leave";
import {svg, height, g, x, y, z, line} from "./render";
import {drawAxes} from "./burndown-axes";
import {drawBounds} from "./burndown-bounds";
import {drawPastTrend, drawFutureTrend} from "./burndown-trend";
import {drawLostArea} from "./burndown-lost-area";
import {drawPerson} from "./burndown-person";
import {drawTodayLine} from "./burndown-today-line";
import {drawUnavailableArea} from "./burndown-unavailable-area";

Promise.all([
  getLeave(),
  getBankHolidays()
]).then(([ [data, all_dates, people], bank_holidays ]) => {

  var max_days = d3.max(people, function(c) {
    return d3.max(c.values, d => d.days);
  });

  x.domain(d3.extent(data, d => d.date));
  y.domain([0, max_days]);
  z.domain(people.map(function(c) { return c.id; }));

  // area.y0(y(d3.max(data, function(d) { return d.close; })));
  // area.y0(y(0));

  drawUnavailableArea(g, all_dates, bank_holidays, x, y);
  drawLostArea(g, all_dates, bank_holidays, max_days, x, y);
  drawBounds(g, all_dates, bank_holidays, line);
  drawTodayLine(g, x, y);
  drawFutureTrend(g, people, all_dates, line);
  drawPerson(svg, g, people, line, x, y);
  drawPastTrend(g, people, all_dates, line);
  drawAxes(g, height, x, y);
})
.catch((error) => {
  console.log(`error: ${error}`);
});
