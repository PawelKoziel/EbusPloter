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
  var plotSize = { width: 1200, height: 700}
  
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 0, bottom: 70, left: 30 }
  
  //plot drawing size
  var drawSize = { 
    width : plotSize.width - margin.left - margin.right,
    height : plotSize.height - margin.bottom - margin.top
  }

  // append the svg object to the body of the page
  var chart = d3
    .select("#plot-temp")
    .append("svg")
    .attr("width", plotSize.width)
    .attr("height", plotSize.height)
    .attr("preserveAspectRatio","xMidYMin")
    //.attr("style", "border:1px solid red")
    .attr('viewbox', `0 0 ${plotSize.width} ${plotSize.height}`)
    .append("g")

  //prostokąt po to żeby zoom działał

  var kwadrat = chart
  .append("defs")
  .append("clipPath")
  .attr("id", "clip")

  .attr("width", plotSize.width)
  .attr("height", plotSize.height)


  var minDate = temps[temps.length-6*24*7].date
  var maxDate = temps[temps.length-1].date
  console.log("mindate", minDate);
  console.log("maxdate", maxDate);

  // -------------------------------------- oś X ----------------------------
  // Add X scale
  var xScale = d3.scaleTime()
    //.domain([d3.min(temps,d=>d.date), d3.max(temps,d=>d.date)])
    //.domain(d3.extent(temps, (d) => d.date))
    .domain([minDate,maxDate])
    .range([margin.left, drawSize.width])

  // Add X axis
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.timeFormat('%d-%m'));
    //.tickFormat(d3.timeFormat('%d-%m / %H:%M'));

  var gX = chart.append("g")
    .attr("transform", `translate(0,${drawSize.height})`)
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
    .domain(d3.extent(temps, (d) => d.outdoor))
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



  // INDOOR
  var indoor = chart
    .append("path")
    .datum(temps)
    .attr("fill", "none")
    .attr("stroke", colorIndoor)
    //.attr("stroke-width", 2.5)
    .attr(
      "d",
      d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.outdoor))
    );


  var zoom = d3.zoom()
    .scaleExtent([0.5, 2]) 
    .translateExtent([[0, 0], [drawSize.width, drawSize.height]])
    .on("zoom", onZoom);

  chart.call(zoom)


  function onZoom() {
    console.log("onZoom");
    var transform = d3.event.transform;
    var new_xScale = transform.rescaleX(xScale)
    var transformString = 'translate(' + transform.x + ',' + '0) scale(' + transform.k + ',1)';
    console.log("Transform", transformString)
    indoor.attr("x", d => new_xScale(d.date));
    indoor.call(xAxis.scale(new_xScale))
    indoor.attr("transform", transformString)
    xAxis.scale(new_xScale);
    gX.call(xAxis);


    gX.selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-75)");
  }





  function onZoomols() {

    console.log("onZoom")


    const t = d3.event.transform,
      // rescale the x linear scale so that we can draw the top axis
      xt = t.rescaleX(xScale);

    chart.call(xAxis.scale(xt))



  }



}