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

  const DateTime = luxon.DateTime;

  temps.forEach(d =>
    d.date = d3.isoParse(d.date)
  );

  let last_daystr = null;
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
    .attr('viewBox', `0 0 ${width} ${height}`)
    .append("g")

  //prostokąt po to żeby zoom działał
  var kwadrat = chart.append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "plot")
    .attr("fill", "#FFFFFF")



  // -------------------------------------- oś X ----------------------------
  // Add X scale
  var xScale = d3.scaleTime()
    .domain(d3.extent(temps, (d) => d.date))
    .range([0, width])

  // Add X axis
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.timeFormat('%d-%b / %H:%m'));

  var gX = chart.append("g")
    .attr("transform", `translate(0,${height - 400})`)
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
    .range([height, 0])
    .nice()

  // Add Y axis
  var yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(8)
    .tickSize(-width);
    
  chart.append("g")
    .classed('y', true)
    .classed('axis', true)
    .call(yAxis);


  // -------------------------------------- linie ----------------------------

  // INDOOR
  var indoor = chart
    .append("path")
    .datum(temps)
    .attr("fill", "none")
    .attr("stroke", colorIndoor)
    .attr("stroke-width", 2.5)
    .attr(
      "d",
      d3
        .line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.outdoor))
    );


  var zoom = d3.zoom()
    .scaleExtent([1, 1])
    .translateExtent([[0, 0], [width, height]])
    .on("zoom", onZoom);

  chart.call(zoom)


  function onZoom() {
    var transform = d3.event.transform;
    var new_xScale = transform.rescaleX(xScale)

    var transformString = 'translate(' + transform.x + ',' + '0) scale(' + transform.k + ',1)';
    indoor.attr("x", d => new_xScale(d.date));
    chart.call(xAxis.scale(new_xScale))
    indoor.call(xAxis.scale(new_xScale))
    indoor.attr("transform", transformString)


    // gX.selectAll("text")
    // .style("text-anchor", "end")
    // .attr("dx", "-.8em")
    // .attr("dy", ".15em")
    // .attr("transform", "rotate(-75)");
  }










  function onZoomols() {

    console.log("onZoom")


    const t = d3.event.transform,
      // rescale the x linear scale so that we can draw the top axis
      xt = t.rescaleX(xScale);

    chart.call(xAxis.scale(xt))



  }



}