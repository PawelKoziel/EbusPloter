import { getData } from './getData.js'

function main() {
  d3.json('http://127.0.0.1:3001/api/parms')
    .then(data => drawChart(data))
    .catch(error => console.log(error))
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

  data.forEach(d => {
    //d.date = d3.isoParse(d.date);
    d.power = (d.power / 100)
    d.valvePosition = (1 + d.valvePosition / 400) //chart looks better that way
  });


  const colorValve = "black";
  const colorPower = "#e02e2e";
  const colorPress = "#30b0d9";

  // total chart size
  var totalSize = { width: 1200, height: 700 }

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 0, bottom: 30, left: 30 }

  //plot drawing size
  var drawSize = {
    width: totalSize.width - margin.left - margin.right,
    height: totalSize.height - margin.bottom - margin.top
  }


  // append the svg object to the body of the page
  var chart = d3
    .select("#plot-parms")
    .append("svg")
    .attr("width", totalSize.width)
    .attr("height", totalSize.height)
    .attr('viewbox', `0 0 ${totalSize.width} ${totalSize.height}`)
    .append("g")


  // -------------------------------------- oś X ----------------------------
  //Add X scale
  var xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.id))
    .range([margin.left, drawSize.width]);

  // Add X axis
  var xAxis = d3.axisBottom()
    .scale(xScale);
    //.tickFormat(d3.timeFormat('%d-%m / %H:%M'));

  var gX = chart.append("g")
    .attr("transform", `translate(0,${drawSize.height})`)
    .call(xAxis);

  gX.selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-75)");



    // var xScale = d3.scaleTime()
    // .domain(d3.extent(data, d => d.date))
    // .range([margin.left, drawSize.width])


  // Add X axis
  // var xAxis = d3.axisBottom()
  //   .scale(xScale)
  //   .tickFormat(d3.timeFormat('%d-%m'))
  //   .ticks(20)
  //   .tickSize(-drawSize.height)
  // //.tickFormat(d3.timeFormat('%d-%m / %H:%M'));

  // var gX = chart.append("g")
  //   .attr("transform", `translate(0,${drawSize.height})`)
  //   .classed('y', true)
  //   .classed('axis', true)
  //   .call(xAxis)

  //   gX.selectAll("text")
  //   .style("text-anchor", "end")
  //   .attr("dx", "-.8em")
  //   .attr("dy", ".15em")
  //   .attr("transform", "rotate(-75)");


  // -------------------------------------- oś Y ----------------------------
  // Add Y scale
  var yScale = d3.scaleLinear()
    .domain([-0.2, 2])
    .range([drawSize.height, margin.top])

  //  Y Axis
  var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(10)
    .tickSize(-drawSize.width);

  chart.append("g")
    .classed('y', true)
    .classed('axis', true)
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);


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


  //valvePosition
  var valvePosition = chart
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", colorValve)
//    
    .attr("d", d3.line()
      .x((d) => xScale(d.id))
      .y((d) => yScale(d.valvePosition))
    );

  //power
  var power = chart
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", colorPower)
    .attr("stroke-width", 2.5)
    .attr("d", d3.line()
      .x((d) => xScale(d.id))
      .y((d) => yScale(d.power))
    );

  // Water pressure
  var pressure = chart
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", colorPress)
    .attr("d", d3.line()
      .x((d) => xScale(d.id))
      .y((d) => yScale(d.waterpressure))
    );

  // Legend
  chart.append("circle").attr("cx", totalSize.width - 100).attr("cy", 20).attr("r", 6).style("fill", colorPress)
  chart.append("circle").attr("cx", totalSize.width - 100).attr("cy", 40).attr("r", 6).style("fill", colorPower)
  chart.append("circle").attr("cx", totalSize.width - 100).attr("cy", 60).attr("r", 6).style("fill", colorValve)
  chart.append("text").attr("x", totalSize.width - 90).attr("y", 25).text("pressure").style("font-size", "15px").attr("alignment-baseline", "middle")
  chart.append("text").attr("x", totalSize.width - 90).attr("y", 45).text("power").style("font-size", "15px").attr("alignment-baseline", "middle")
  chart.append("text").attr("x", totalSize.width - 90).attr("y", 65).text("valvePosition").style("font-size", "15px").attr("alignment-baseline", "middle")



  // -------------------------------------- zoom ----------------------------
  let zoom = d3.zoom()
    .scaleExtent([0.5, 8]) //limity zoom
    .translateExtent([[0, 0], [drawSize.width, drawSize.height]])
    .extent([[0, 0], [drawSize.width, drawSize.height]]) //limity draw
    .on("zoom", zoomed)

  function zoomed(event) {
    //pobranie aktualnej skali x
    let xz = event.transform.rescaleX(xScale);

    //zoom linii danych
    valvePosition.attr("d", d3.line()
      .x(d => xz(d.id))
      .y(d => yScale(d.valvePosition)));

    power.attr("d", d3.line()
      .x(d => xz(d.id))
      .y(d => yScale(d.power)));

    pressure.attr("d", d3.line()
      .x(d => xz(d.id))
      .y(d => yScale(d.waterpressure)));

    //zoom osi x  
    gX.call(xAxis.scale(xz));

    // obrót tekstu osi
    gX.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-75)");
  };

  //prostokąt po to żeby zoom działał na całym obszarze 
  chart.append("rect")
    .attr("width", drawSize.width)
    .attr("height", drawSize.height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .call(zoom);

}



