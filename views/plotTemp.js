import { getData } from './getData.js'


function main() {
  getData('temps')
    .then(
      data => {
        drawChart(data);
      })
    .catch(
      error => console.log(error)
    )
}

main();



//d3.time.format.iso
//var iso = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");
// date: "2021-08-24 10:30:02.941263"
// ​​flowActual: 0
// ​​flowReqired: 0
// ​​flowReturn: 24.38
// ​​hwcWater: 33
// ​​id: 201
// ​​indoor: 21.375
// ​​outdoor: 14.5

function drawChart(temps) {

  temps.forEach(d =>
    d.date = d3.isoParse(d.date)
  );

  const colorIndoor = "#da7c20";
  const colorOutdoor = "#33cc66";
  const colorHwc = "blueviolet";

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 }
  var width = 1200 - margin.left - margin.right;
  var height = 700 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var chart = d3
    .select("#plot-temp")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3
    .scaleTime()
    .domain(d3.extent(temps, (d) => d.date))
    .range([0, width]);

  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
      .tickFormat(d3.timeFormat('%d-%b / %H:%m')));

  // Add Y axis
  var yScale = d3
    .scaleLinear()
    .domain([d3.min(temps, (d) => Math.min(d.outdoor, d.indoor, d.hwcWater)) - 2
           , d3.max(temps, (d) => Math.max(d.outdoor, d.indoor, d.hwcWater)) + 2])
    .range([height, 0]);
 
  var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(8)
    .tickSize(-width);

  chart.append("g")
    .classed('y', true)
    .classed('axis', true)
    .call(yAxis);

  //Additional Axis info
  chart
    .append("text")
    .attr("x", `-${height / 2}`)
    .attr("dy", "-2em")
    .attr("transform", "rotate(-90)")
    .text("temperatura [C]");
  chart
    .append("text")
    .attr("x", `${width - 50}`)
    .attr("y", `${height -10}`)
    .text("data / godz");

  // Legenda
  chart.append("circle").attr("cx", width - 100).attr("cy", 10).attr("r", 6).style("fill", colorHwc)
  chart.append("circle").attr("cx", width - 100).attr("cy", 30).attr("r", 6).style("fill", colorOutdoor)
  chart.append("circle").attr("cx", width - 100).attr("cy", 50).attr("r", 6).style("fill", colorIndoor)
  chart.append("text").attr("x", width - 90).attr("y", 15).text("cwu").style("font-size", "12px").attr("alignment-baseline", "middle")
  chart.append("text").attr("x", width - 90).attr("y", 35).text("zewnątrz").style("font-size", "12px").attr("alignment-baseline", "middle")
  chart.append("text").attr("x", width - 90).attr("y", 55).text("dom").style("font-size", "12px").attr("alignment-baseline", "middle")

  // Create the circle that travels along the curve of chart
  var focus = chart
    .append("g")
    .append("circle")
    .style("fill", "none")
    .attr("stroke", "black")
    .attr("r", 8.5)
    .style("opacity", 0);

  // Create the text that travels along the curve of chart
  var focusText = chart
    .append("g")
    .append("text")
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle");

  const hwcMin = d3.min(temps, (d) => +d.hwcWater);
  const hwcMax = d3.max(temps, (d) => +d.hwcWater);
  console.log("min:", hwcMin, ", max: ", hwcMax);

  //  Set the gradient
  chart
    .append("linearGradient")
    .attr("id", "line-gradient")
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0)
    .attr("y1", yScale(hwcMin))
    .attr("x2", 0)
    .attr("y2", yScale(hwcMax))
    .selectAll("stop")
    .data([
      { offset: "0%", color: "blue" },
      { offset: "100%", color: "red" },
    ])
    .enter()
    .append("stop")
    .attr("offset", function (d) {
      return d.offset;
    })
    .attr("stop-color", function (d) {
      return d.color;
    });


  // INDOOR
  chart
    .append("path")
    .datum(temps)
    .attr("fill", "none")
    .attr("stroke", colorIndoor)
    .attr("stroke-width", 2.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.date))
        .y((d) => yScale(d.indoor))
    );

  // OUTDOOR
  chart
    .append("path")
    .datum(temps)
    .attr("fill", "none")
    .attr("stroke", colorOutdoor)
    .attr("stroke-width", 2.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.date))
        .y((d) => yScale(d.outdoor))
    );

  // hwc Water
  chart
    .append("path")
    .datum(temps)
    .attr("fill", "none")
    .attr("stroke", "url(#line-gradient)") //add gradient to hwcWater
    .attr("stroke-width", 2.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.date))
        .y((d) => yScale(d.hwcWater))
    );




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



