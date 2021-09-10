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

    data.forEach(d=>
      d.date = d3.isoParse(d.date)
    );

  const colorHcSum = "#cc6262";
  const colorHcCnt = "#5e9ace";
  const colorHwcSum = "#d50f0f";
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


  // ------------------------------------------ X axis
  var xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.id))
    .range([0, width]);

  var xAxis = d3.axisBottom(xScale);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  console.log("hcEnergySum", d3.extent(data, (d) => d.hcEnergySum));
  console.log("hwcEnergySum", d3.extent(data, (d) => d.hwcEnergySum));
  console.log("hcEnergyCnt", d3.extent(data, (d) => d.hcEnergyCnt));
  console.log("hwcEnergyCnt:", d3.extent(data, (d) => d.hwcEnergyCnt));


  // ------------------------------------------ Y axis

  // y sum
  var ySumScale = d3  //zdefiniowanie skali dla danych
    .scaleLinear()       // typ skali
    .domain(d3.extent(data, (d) => d.hwcEnergySum)) //zakres danych
    .range([height, 0]); //wysokość na wykresie

  var ySumAxis = d3.axisLeft()    // zdefiniowanie osi 
    .scale(ySumScale)             // dołączenie skali
    .tickFormat(d3.format(".3s")) // format naukowy 3-cyfrowy
    .tickSize(-width - 20)        // długość kresek na osi
    .ticks(5);                    // ilość kresek na osi

  var ySymGraph = svg.append("g").call(ySumAxis)   //dodanie osi do wykresu
    .attr("transform", "translate(-20,0)") //przesunięcie osi w poziomie
    .selectAll("text").style("stroke", colorHcSum); // kolor napisów



  // Y counters
  var yCntScale = d3
    .scaleSqrt()
    .domain(d3.extent(data, (d) => d.hwcEnergyCnt))
    .range([height, 0]);

  var yCntAxis = d3.axisRight()
    .scale(yCntScale)
    .tickFormat(d3.format(".3s")); // format naukowy z 3 cyframi

  svg.append("g").call(yCntAxis)
    .attr("transform", `translate(${width},0)`)
    .selectAll("text").style("stroke", colorHcCnt);

  //kreskowane ticks
  svg.selectAll("line")
    .style("stroke", "grey")
    .style("stroke-dasharray", "4,4")



  // // hcEnergySum
  // svg
  //   .append("path")
  //   .datum(data)
  //   .attr("fill", "none")
  //   .attr("stroke", colorHcSum)
  //   .attr("stroke-width", 2.5)
  //   .attr(
  //     "d",
  //     d3
  //       .line()
  //       .x((d) => xScale(d.id))
  //       .y((d) => ySumScale(d.hcEnergySum))
  //   );

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
        .x((d) => xScale(d.id))
        .y((d) => ySumScale(d.hwcEnergySum))
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
        .x((d) => xScale(d.id))
        .y((d) => yCntScale(d.hcEnergyCnt))
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
        .x((d) => xScale(d.id))
        .y((d) => yCntScale(d.hwcEnergyCnt))
    );



  // Legend
  svg.append("circle").attr("cx", 0).attr("cy", 20).attr("r", 6).style("fill", colorHcSum)
  svg.append("circle").attr("cx", 0).attr("cy", 40).attr("r", 6).style("fill", colorHcCnt)
  svg.append("circle").attr("cx", 0).attr("cy", 60).attr("r", 6).style("fill", colorHwcSum)
  svg.append("circle").attr("cx", 0).attr("cy", 80).attr("r", 6).style("fill", colorHwcCnt)
  svg.append("text").attr("x", 10).attr("y", 25).text("hcEnergyCnt").style("font-size", "15px").attr("alignment-baseline", "middle")
  svg.append("text").attr("x", 10).attr("y", 45).text("hcEnergySum").style("font-size", "15px").attr("alignment-baseline", "middle")
  svg.append("text").attr("x", 10).attr("y", 65).text("hwcEnergyCnt").style("font-size", "15px").attr("alignment-baseline", "middle")
  svg.append("text").attr("x", 10).attr("y", 85).text("hwcEnergySum").style("font-size", "15px").attr("alignment-baseline", "middle")

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


