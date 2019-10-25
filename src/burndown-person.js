var colour = function(_id) {
  return "steelblue";
  // return z(id);
};

function mouseover(svg, d, i) {
  svg.selectAll("g.person")
     .classed("unselected", true );

  svg.selectAll("g.person.esr" + i)
     .classed("unselected", false );

  svg.selectAll("g.person.esr" + i)
     .classed("selected", true );
}

function mouseout(svg, d, i) {
  svg.selectAll("g.person")
     .classed("unselected", false);

  svg.selectAll("g.person.esr" + i)
     .classed("selected", false );
}

function drawPerson(svg, g, people, line, x, y) {
  var person = g.selectAll(".person")
    .data(people)
    .enter().append("g")
      .attr("class", function(d, i) { return "person esr" + i; })
      .attr("title", d => d.id)
      ;

  person.append("path")
      .attr("class", "line")
      // .attr("title", function(d) { return d.id; })
      .attr("d", function(d) { return line(d.values.filter(function(d){
        return d.date <= new Date();
      })); })
      .style("stroke", d => colour(d.id))
      ;

  person.append("path")
      .attr("class", "line planned")
      // .attr("title", function(d) { return d.id; })
      .attr("d", function(d) { return line(d.values.filter(function(d){
        return d.date > new Date();
      })); })
      .style("stroke", d => colour(d.id))
      ;

  person.append("path")
      .attr("class", "target")
      // .attr("title", function(d) { return d.id; })
      .attr("d", d => line(d.values))
      .style("stroke", d => colour(d.id))
      .on("mouseover", function(d, i) { return mouseover(svg, d, i); })
      .on("mouseout", function(d, i) { return mouseout(svg, d, i); })
      ;

  person.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.filter(function(d){
        return d.date <= new Date();
      }).length - 1]}; })
      .attr("class", "bg")
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.days) + ")"; })
      .attr("x", 5)
      .attr("dy", -5)
      .text(function(d) { return d.id; });

  person.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.filter(function(d){
        return d.date <= new Date();
      }).length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.days) + ")"; })
      .attr("x", 5)
      .attr("dy", -5)
      .text(function(d) { return d.id; });

  return person;
}

export {drawPerson};
