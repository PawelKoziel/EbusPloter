import { getParmData } from './getData.js'

function main() {
  getParmData('parms')
    .then(
      data => {
        drawChart(data);
      })
    .catch(
      error => console.log(error)
    )
}

main();


// 1
// flame	0
// power	16
// waterpressure	1.426
// blockTime	0
// valvePosition	0
// hwcPump

function drawChart(temps) {

  //  temps.forEach(d=>
  //    d.date = d3.isoParse(d.date)
  //  );

  temps.forEach(p =>
    p.power = (p.power / 100)
  )

  const colorFlame = "black";
  const colorPower = "#e02e2e";
  const colorPress = "#30b0d9";

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 }
  var width = 1200 - margin.left - margin.right;
  var height = 700 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#plot-parms")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  // Add X axis
  var x = d3
    .scaleLinear()
    .domain(d3.extent(temps, (d) => d.id))
    .range([0, width]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      0,
      2//d3.max(temps, (d) => Math.max(d.waterpressure)),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  //   svg
  //   .append("text")
  //   .attr("x", `-${height / 2}`)
  //   .attr("dy", "-2em")
  //   .attr("transform", "rotate(-90)")
  //   .text("temperatura [C]");
  // svg
  //   .append("text")
  //   .attr("x", `${width -30}`)
  //   .attr("y", `${height + 20}`)
  //   .text("data / godz");



  // // Create the circle that travels along the curve of chart
  // var focus = svg
  //   .append("g")
  //   .append("circle")
  //   .style("fill", "none")
  //   .attr("stroke", "black")
  //   .attr("r", 8.5)
  //   .style("opacity", 0);

  // // Create the text that travels along the curve of chart
  // var focusText = svg
  //   .append("g")
  //   .append("text")
  //   .style("opacity", 0)
  //   .attr("text-anchor", "left")
  //   .attr("alignment-baseline", "middle");

  const hwcMin = d3.min(temps, (d) => +d.waterpressure);
  const hwcMax = d3.max(temps, (d) => +d.waterpressure);
  console.log("min:", hwcMin, ", max: ", hwcMax);

  const Min2 = d3.min(temps, (d) => +d.power);
  const Max2 = d3.max(temps, (d) => +d.power);
  console.log("min:", Min2, ", max: ", Max2);

  //  Set the gradient
  // svg
  //   .append("linearGradient")
  //   .attr("id", "line-gradient")
  //   .attr("gradientUnits", "userSpaceOnUse")
  //   .attr("x1", 0)
  //   .attr("y1", y(hwcMin))
  //   .attr("x2", 0)
  //   .attr("y2", y(hwcMax))
  //   .selectAll("stop")
  //   .data([
  //     { offset: "0%", color: "blue" },
  //     { offset: "100%", color: "red" },
  //   ])
  //   .enter()
  //   .append("stop")
  //   .attr("offset", function (d) {
  //     return d.offset;
  //   })
  //   .attr("stop-color", function (d) {
  //     return d.color;
  //   });

  //flame
  svg
    .append("path")
    .datum(temps)
    .attr("fill", "none")
    .attr("stroke", colorFlame)
    .attr("stroke-width", 2.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.id))
        .y((d) => y(d.flame))
    );

  // power
  svg
    .append("path")
    .datum(temps)
    .attr("fill", "none")
    .attr("stroke", colorPower)
    .attr("stroke-width", 2.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.id))
        .y((d) => y(d.power))
    );

  // Water pressure
  svg
    .append("path")
    .datum(temps)
    .attr("fill", "none")
    .attr("stroke", colorPress)
    .attr("stroke-width", 2.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.id))
        .y((d) => y(d.waterpressure))
    );

  // Legend
  svg.append("circle").attr("cx", width - 100).attr("cy", 20).attr("r", 6).style("fill", colorPress)
  svg.append("circle").attr("cx", width - 100).attr("cy", 40).attr("r", 6).style("fill", colorPower)
  svg.append("circle").attr("cx", width - 100).attr("cy", 60).attr("r", 6).style("fill", colorFlame)
  svg.append("text").attr("x", width - 90).attr("y", 25).text("pressure").style("font-size", "15px").attr("alignment-baseline", "middle")
  svg.append("text").attr("x", width - 90).attr("y", 45).text("power").style("font-size", "15px").attr("alignment-baseline", "middle")
  svg.append("text").attr("x", width - 90).attr("y", 65).text("flame").style("font-size", "15px").attr("alignment-baseline", "middle")



  // Create a rect on top of the svg area: this rectangle recovers mouse position
  // svg
  //   .append("rect")
  //   .style("fill", "none")
  //   .style("pointer-events", "all")
  //   .attr("width", width)
  //   .attr("height", height)
  //   .on("mouseover", mouseover)
  //   .on("mousemove", mousemove)
  //   .on("mouseout", mouseout);


  // This allows to find the closest X index of the mouse:
  // var bisect = d3.bisector(d => d.id).left;


  // // What happens when the mouse move -> show the annotations at the right positions.
  // function mouseover() {
  //   focus.style("opacity", 1);
  //   focusText.style("opacity", 1);
  // }

  // function mousemove() {
  //   // recover coordinate we need
  //   var x0 = x.invert(d3.mouse(this)[0]);
  //   var i = bisect(temps, x0, 1);
  //   let selectedData = temps[i];
  //   focus.attr("cx", x(selectedData.id)).attr("cy", y(selectedData.hwcWater));
  //   focusText
  //     .html("id:" + selectedData.id + "  -  " + "temp:" + selectedData.hwcWater)
  //     .html("temp:" + selectedData.hwcWater)
  //     .attr("x", x(selectedData.id) + 15)
  //     .attr("y", y(selectedData.hwcWater));
  // }

  // function mouseout() {
  //   focus.style("opacity", 0);
  //   focusText.style("opacity", 0);
  // }
}



