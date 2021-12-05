import { getData } from './getData.js'

function main() {
  d3.json('http://127.0.0.1:3001/api/temps')
    .then(data => drawChart(data))
    .catch(error => console.log(error))
}

main();



function drawChart(temps) {

  //const DateTime = luxon.DateTime;

  temps.forEach(d =>
    d.date = d3.isoParse(d.date)
  );

  let last_daystr = null;
  const colorIndoor = "#da7c20";
  const colorOutdoor = "#33cc66";
  const colorHwc = "blueviolet";

  // total chart size
  var totalSize = { width: 1200, height: 700 }

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 0, bottom: 60, left: 30 }

  //plot drawing size
  var drawSize = {
    width: totalSize.width - margin.left - margin.right,
    height: totalSize.height - margin.bottom - margin.top
  }


  // append the svg object to the body of the page
  var chart = d3
    .select("#plot-temp")
    .append("svg")
    .attr("width", totalSize.width)
    .attr("height", totalSize.height)
    .attr('viewbox', `0 0 ${totalSize.width} ${totalSize.height}`)
    .append("g")
  //.attr("style", "border:1px solid red")
  //  .attr("preserveAspectRatio", "xMidYMin")
  //.call(zoom)



  // -------------------------------------- oś X ----------------------------
  // Add X scale
  var xScale = d3.scaleTime()
    .domain(d3.extent(temps, d => d.date))
    .range([margin.left, drawSize.width])
  //.domain([d3.min(temps,d=>d.date), d3.max(temps,d=>d.date)])
  //.domain([minDate, maxDate])

  // Add X axis
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.timeFormat('%d-%m'))
    .ticks(20)
    .tickSize(-drawSize.height)
  //.tickFormat(d3.timeFormat('%d-%m / %H:%M'));

  var gX = chart.append("g")
    .attr("transform", `translate(0,${drawSize.height})`)
    .classed('y', true)
    .classed('axis', true)
    .call(xAxis)

  gX.selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-75)");


  // -------------------------------------- oś Y ----------------------------
  // Add Y scale
  var yScale = d3
    .scaleLinear()
    .domain([d3.min(temps, d => d.outdoor), d3.max(temps, d => d.hwcWater)])
    //.domain(d3.extent(temps, (d) => d.hwcWater))
    .range([drawSize.height, margin.top])
    .nice()

  // Add Y axis
  var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(8)
    .tickSize(-drawSize.width);

  chart.append("g")
    .classed('y', true)
    .classed('axis', true)
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);


  // -------------------------------------- linie ----------------------------


  // HWC
  var hwc = chart
    .append("path")
    .datum(temps)
    .attr("fill", "none")
    .attr("stroke", colorHwc)
    //.attr("stroke-width", 2.5)
    .attr("d",
      d3.line()
        //.curve(d3.curveBundle.beta(0.6))
        .x(d => xScale(d.date))
        .y(d => yScale(d.hwcWater))
    );

  // INDOOR
  var indoor = chart
    .append("path")
    .datum(temps)
    .attr("fill", "none")
    .attr("stroke", colorIndoor)
    //.attr("stroke-width", 2.5)
    .attr("d",
      d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.indoor))
    );


  // OUTDOOR
  var outdoor = chart
    .append("path")
    .datum(temps)
    .attr("fill", "none")
    .attr("stroke", colorOutdoor)
    //.attr("stroke-width", 2.5)
    .attr("d",
      d3.line()
        //  .curve(d3.curveBundle.beta(0.021)) //linia trendu
        .x(d => xScale(d.date))
        .y(d => yScale(d.outdoor))
    );


  // Legend
  chart.append("circle").attr("cx", totalSize.width - 100).attr("cy", 20).attr("r", 6).style("fill", colorHwc)
  chart.append("circle").attr("cx", totalSize.width - 100).attr("cy", 40).attr("r", 6).style("fill", colorIndoor)
  chart.append("circle").attr("cx", totalSize.width - 100).attr("cy", 60).attr("r", 6).style("fill", colorOutdoor)
  chart.append("text").attr("x", totalSize.width - 90).attr("y", 25).text("hwc").style("font-size", "15px").attr("alignment-baseline", "middle")
  chart.append("text").attr("x", totalSize.width - 90).attr("y", 45).text("indoor").style("font-size", "15px").attr("alignment-baseline", "middle")
  chart.append("text").attr("x", totalSize.width - 90).attr("y", 65).text("outdoor").style("font-size", "15px").attr("alignment-baseline", "middle")


  // -------------------------------------- zoom ----------------------------

  let zoom = d3.zoom()
    .scaleExtent([0.5, 4]) //limity zoom
    .translateExtent([[0, 0], [drawSize.width, drawSize.height]])
    .extent([[0, 0], [drawSize.width, drawSize.height]]) //limity draw
    .on("zoom", zoomed)

  function zoomed(event) {
    //pobranie aktualnej skali x
    let xz = event.transform.rescaleX(xScale);

    //zoom linii danych
    indoor.attr("d", d3.line()
      .x(d => xz(d.date))
      .y(d => yScale(d.indoor)));

    outdoor.attr("d", d3.line()
      .x(d => xz(d.date))
      .y(d => yScale(d.outdoor)));

    hwc.attr("d", d3.line()
      .x(d => xz(d.date))
      .y(d => yScale(d.hwcWater)));

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