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

  // const zoom = d3.zoom()
  // .scaleExtent([1, 10000])
  // .translateExtent([[0, 0], [width, height]])
  // .on('zoom', () => onZoom())
  var xScale;

  const zoom = d3.zoom()
    .scaleExtent([1, 10000])
    .translateExtent([[0, 10], [width, height]])
    .on('zoom', () => onZoom())




  // append the svg object to the body of the page
  var chart = d3
    .select("#plot-temp")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .append("g")
    .call(zoom)
  //  .call(drag)

  // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")




  // Add X scale
  xScale = d3.scaleTime()
    //.domain([dateNiceToStartOfMonth(offsetToDate(-2.628e9)), dateNiceToStartOfMonth(offsetToDate(3.154e10))])
    .domain(d3.extent(temps, (d) => d.date))
    .range([0, width])
    .nice()






  // Add X axis
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.timeFormat('%d-%b / %H:%m'));
    //.tickFormat(tickFormat)

  // chart.append("g")
  // .attr("transform", "translate(0," + height + ")")     
  //   .attr("class", "axis axis--x")
  //   .call(xAxis);

   var graphGroup = chart.append("g")
      .attr("class", "axis axis--x")
     .call(xAxis)

   graphGroup.selectAll("text")
     .style("text-anchor", "end")
     .attr("dx", "-.8em")
     .attr("dy", ".15em")
     .attr("transform", "rotate(-75)");



  function onZoom() {

    console.log("onZoom")
     const t = d3.event.transform,
      // rescale the x linear scale so that we can draw the top axis
      xt = t.rescaleX(xScale);

      graphGroup.call(xAxis.scale(xt))

      graphGroup.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-75)");

  }







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
    .attr("y", `${height - 10}`)
    .text("data / godz");

  // Legenda
  chart.append("circle").attr("cx", width - 100).attr("cy", 10).attr("r", 6).style("fill", colorHwc)
  chart.append("circle").attr("cx", width - 100).attr("cy", 30).attr("r", 6).style("fill", colorOutdoor)
  chart.append("circle").attr("cx", width - 100).attr("cy", 50).attr("r", 6).style("fill", colorIndoor)
  chart.append("text").attr("x", width - 90).attr("y", 15).text("cwu").style("font-size", "12px").attr("alignment-baseline", "middle")
  chart.append("text").attr("x", width - 90).attr("y", 35).text("zewnątrz").style("font-size", "12px").attr("alignment-baseline", "middle")
  chart.append("text").attr("x", width - 90).attr("y", 55).text("dom").style("font-size", "12px").attr("alignment-baseline", "middle")

  // // Create the circle that travels along the curve of chart
  // var focus = chart
  //   .append("g")
  //   .append("circle")
  //   .style("fill", "none")
  //   .attr("stroke", "black")
  //   .attr("r", 8.5)
  //   .style("opacity", 0);

  // // Create the text that travels along the curve of chart
  // var focusText = chart
  //   .append("g")
  //   .append("text")
  //   .style("opacity", 0)
  //   .attr("text-anchor", "left")
  //   .attr("alignment-baseline", "middle");




  // chart.append('rect')
  //   .attr('class', 'background')
  //   .attr('pointer-events', 'all')
  //   .attr('fill', 'none')
  //   .attr('height', height + 'px')
  //   .attr('width', width + 'px')



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
        .x((d) => xScale(d.date))
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
        .x((d) => xScale(d.date))
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
        .x((d) => xScale(d.date))
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




  // function update() {

  //   var rects = d3.select('.rects').selectAll('rect')
  //     .data(d)

  //   rects.attr('x', (d, i) => xScale)
  //     .attr('width', xScale.rangeBand())
  //     .attr('y', d => yScale(d))
  //     .attr('height', d => (height - yScale(d)))

  //   rects.enter().append('rect')
  //     .attr('x', (d, i) => xScale(i))
  //     .attr('width', xScale.rangeBand())
  //     .attr('y', (d) => y(d))
  //     .attr('height', (d) => (height - yScale(d)))
  //     .style('fill', 'orange')
  //   svg.select('.y.axis')
  //     .call(yax)
  //   svg.select('.x.axis')
  //     .call(xax)
  //   svg.select('.background')
  //     .call(zoom)
  //   svg.select('.background')
  //     .call(drag)
  // }


  // var zoom = d3.behavior.zoom()
  //   .on("zoom", zoomed)

  // function zoomed() {
  //   y.domain([0, d3.max(d) * 1 / d3.event.scale])
  //   update();
  // }
  // var drag = d3.behavior.drag()
  //   .on("drag", dragmove).on("dragstart", dragstart);

  // var moved = 0;//record the translate x moved by the g which contains the bars.
  // var dragStartX = 0;//record teh point from where the drag started
  // var oldTranslateX = 0;

  // function dragstart(d) {
  //   dragStartX = d3.event.sourceEvent.clientX;
  //   oldTranslateX = moved;//record the old translate 
  //   console.log(d3.event)
  // }
  // function dragmove(d) {
  //   var x = d3.event.x;
  //   var y = d3.event.y;
  //   var dx = x - dragStartX
  //   x = dx + oldTranslateX + 50; //add teh old translate to the dx to get the resultant translate
  //   moved = x; //record the translate x given
  //   //move the bars via translate x
  //   d3.select('.rects').attr("transform", "translate(" + x + "," + 0 + ")");
  //   //move the x axis via translate x
  //   d3.select('.x').attr("transform", "translate(" + x + " ," + size.y + ")")
  // }
  // update()











}





const base0timestampRightNow = new Date();
// produces timestamp for LOCAL date @ 24:00 hours 
// (last midnight)
function dateToMidnight(d) {

  //Zwraca przesunięcie strefy czasowej w minutach dla bieżącej lokalizacji.
  let tz_offset = d.getTimezoneOffset();
  tz_offset *= 60000;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - tz_offset;
};
const base0timestamp = dateToMidnight(base0timestampRightNow);
console.log("ZERO DATE:", base0timestamp, new Date(base0timestamp));


function dateToOffset(d) {
  const t = d.getTime() - base0timestamp;
  return t;
}

console.log("scale:", d3.extent(temps, (d) => d.date));

function tickFormat(val, idx, ticksArray) {

  if (idx === 0)
    last_daystr = null;

  // don't keep repeating the same day over and over in the ticks
  let fmt = d3.timeFormat("%Y %b %-d");
  let fmt_type = 1;
  let daystr = fmt(val);
  if (daystr === last_daystr) {
    fmt = d3.timeFormat("%H:%M:%S");
    fmt_type = 3;
  }
  else {
    // don't print 00:00:00 time when we do print the date:
    if (val.getHours() === 0 && val.getMinutes() === 0 && val.getSeconds() === 0 && val.getMilliseconds() === 0) {
      fmt = d3.timeFormat("%Y %b %-d");
      fmt_type = 1;
    }
    else {
      fmt = d3.timeFormat("%Y %b %-d %H:%M:%S");
      fmt_type = 2;
    }
    last_daystr = daystr;
  }
  let valstr = fmt(val);

  // Rough example to tweak ticks for today/tomorrow/yesterday:
  if (0) {
    if (fmt_type < 3) {
      let d0 = dateToMidnight(val);
      //console.log("Day compare:", new Date(d0), new Date(base0timestamp), d0 === base0timestamp)
      if (d0 === base0timestamp) {
        if (fmt_type === 1)
          valstr = "(today)";
        else {
          fmt = d3.timeFormat("(today) %H:%M:%S");
          valstr = fmt(val);
        }
      }
      else if (d0 === base0timestamp + 24 * 3600 * 1000) {
        if (fmt_type === 1)
          valstr = "(tomorrow)";
        else {
          fmt = d3.timeFormat("(tomorrow) %H:%M:%S");
          valstr = fmt(val);
        }
      }
      else if (d0 === base0timestamp - 24 * 3600 * 1000) {
        if (fmt_type === 1)
          valstr = "(yesterday)";
        else {
          fmt = d3.timeFormat("(yesterday) %H:%M:%S");
          valstr = fmt(val);
        }
      }
    }
  }
  else {
    // Example using LUXON for printing relative ticks:
    let dt = DateTime.fromJSDate(val);
    let relstr = dt.toRelative({
      base: DateTime.fromMillis(base0timestamp)
    });
    if (idx === 0) {
      valstr = `${relstr}: ${valstr}`;
    }
    else if (idx === ticksArray.length - 1 && fmt_type < 3) {
      // print date at end of range as it will be different
      valstr = `${relstr}: ${valstr}`;
    }
    else {
      // calculate timespan of shown scale:
      let d1 = ticksArray[0].__data__;
      let d2 = ticksArray[ticksArray.length - 1].__data__;
      //console.log({d1, d2, idx, ticksArray})
      const delta1 = dateToOffset(d1);
      const delta2 = dateToOffset(d2);
      let dist1 = Math.abs(delta1);
      let dist2 = Math.abs(delta2);
      let span = Math.abs(delta1 - delta2);
      //console.log({span, dist1, dist2, d1, d2, delta1, delta2})
      if (span <= 14 * 24 * 3600 * 1000 &&
        dist1 <= 7 * 24 * 3600 * 1000 &&
        dist2 <= 7 * 24 * 3600 * 1000) {
        // we're looking at a 3 day range close to ZERO BASE:
        // reckon in hours/minutes/... then!
        let relstr = dt.toRelative({
          //base: DateTime.fromMillis(base0timestamp),
          unit: (span < 35 * 60 * 1000 ? "seconds" :
            span < 35 * 3600 * 1000 ? "minutes" :
              "hours")
        });
        valstr = `${relstr}: ${valstr}`;
      }
    }
  }

  return `${valstr}`;
  //return `${round(delta / (24 * 3600 * 1000), 1)} days`;
}

