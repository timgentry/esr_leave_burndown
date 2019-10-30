function drawTodayLine (g, x, y) {
  g.append('line')
    .attr('class', 'today')
    .attr('x1', () => x(new Date()))
    .attr('x2', () => x(new Date()))
    .attr('y1', () => y(0))
    .attr('y2', 0)
    // <line x1="0"  y1="10" x2="0"   y2="100" style="stroke:#006600;"/>
}

export { drawTodayLine }
