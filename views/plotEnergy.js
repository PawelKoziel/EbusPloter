import { getData } from './getData.js'

function main() {
  getData('energy')
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

function drawChart(data) {

  //  temps.forEach(d=>
  //    d.date = d3.isoParse(d.date)
  //  );

  const colorHcSum = "#cc6262";
  const colorHcCnt = "#d50f0f";
  const colorHwcSum = "#5e9ace";
  const colorHwcCnt = "#0760ae";

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 }
  var width = 1200 - margin.left - margin.right;
  var height = 700 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#plot-energy")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.id))
    .range([0, width]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var ySum = d3
    .scaleLinear()
    .domain([     
      d3.min(data, (d) => Math.min(d.hwcEnergySum)),
      d3.max(data, (d) => Math.max(d.hwcEnergySum)),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(ySum));

  var yCnt = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => Math.min(d.hwcEnergyCnt)),
      d3.max(data, (d) => Math.max(d.hwcEnergyCnt)),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(yCnt)).attr("transform", "translate(-30,0)");


  console.log(` Math.max(d.hcEnergyCnt): ${Math.min(data.map(o=>o.hcEnergySum))}`)
  console.log(` Math.max(d.hcEnergyCnt): ${Math.max(data.map(o=>o.hcEnergySum))}`)
  console.log(` Math.max(d.hcEnergyCnt): ${Math.max(data.map(o=>o.hcEnergyCnt))}`)

 

  // hcEnergySum
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", colorHcSum)
    .attr("stroke-width", 2.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.id))
        .y((d) => ySum(d.hcEnergySum))
    );

  // hcEnergyCnt
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", colorHcCnt)
    .attr("stroke-width", 2.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.id))
        .y((d) => yCnt(d.hcEnergyCnt))
    );
  // hwcEnergySum
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", colorHwcSum)
    .attr("stroke-width", 2.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.id))
        .y((d) => ySum(d.hwcEnergySum))
    );

  // hwcEnergyCnt
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", colorHwcCnt)
    .attr("stroke-width", 2.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.id))
        .y((d) => yCnt(d.hwcEnergyCnt))
    );


  // Legend
  svg.append("circle").attr("cx", width - 100).attr("cy", 20).attr("r", 6).style("fill", colorHcSum)
  svg.append("circle").attr("cx", width - 100).attr("cy", 40).attr("r", 6).style("fill", colorHcCnt)
  svg.append("circle").attr("cx", width - 100).attr("cy", 60).attr("r", 6).style("fill", colorHwcSum)
  svg.append("circle").attr("cx", width - 100).attr("cy", 80).attr("r", 6).style("fill", colorHwcCnt)
  svg.append("text").attr("x", width - 90).attr("y", 25).text("hcEnergyCnt").style("font-size", "15px").attr("alignment-baseline", "middle")
  svg.append("text").attr("x", width - 90).attr("y", 45).text("hcEnergySum").style("font-size", "15px").attr("alignment-baseline", "middle")
  svg.append("text").attr("x", width - 90).attr("y", 65).text("hwcEnergyCnt").style("font-size", "15px").attr("alignment-baseline", "middle")
  svg.append("text").attr("x", width - 90).attr("y", 85).text("hwcEnergySum").style("font-size", "15px").attr("alignment-baseline", "middle")

//Draw a grid


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



