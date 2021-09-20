import { getData } from './getData.js'

function main() {
  d3.json('http://127.0.0.1:3001/api/energy')
    //getData('energy')
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

  data.forEach(d =>
    d.date = d3.isoParse(d.date)
  );

  const colorHcSum = "#cc6262";
  const colorHcCnt = "#5e9ace";
  const colorHwcSum = "#d50f0f";
  const colorHwcCnt = "#0760ae";

  // total chart size
  var totalSize = { width: 1200, height: 700 }

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 0, bottom: 60, left: 30 }

  //plot drawing size
  var drawSize = {
    width: totalSize.width - margin.left - margin.right,
    height: totalSize.height - margin.bottom - margin.top
  }

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 }
  var width = 1200 - margin.left - margin.right;
  var height = 700 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var chart = d3
    .select("#plot-energy")
    .append("svg")
    .attr("width", totalSize.width)
    .attr("height", totalSize.height)
    .attr('viewbox', `0 0 ${totalSize.width} ${totalSize.height}`)
    .append("g")



  // -------------------------------------- oś X ----------------------------
  // Add X scale
  var xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([margin.left, drawSize.width])

  var xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%d-%m / %H:%M'));
  

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
  var ySumScale = d3  //zdefiniowanie skali dla danych
    .scaleLinear()       // typ skali
    .domain(d3.extent(data, (d) => d.hwcEnergySum)) //zakres danych
    .range([drawSize.height, margin.top])//wysokość na wykresie
    .nice()
  var ySumAxis = d3.axisLeft()    // zdefiniowanie osi 
    .scale(ySumScale)             // dołączenie skali
    .tickFormat(d3.format(".3s")) // format naukowy 3-cyfrowy
    .tickSize(-drawSize.width - margin.left)        // długość kresek na osi
    .ticks(5);                    // ilość kresek na osi

  chart.append("g").call(ySumAxis)   //dodanie osi do wykresu
    .attr("transform", `translate(${margin.right},0)`) //przesunięcie osi w poziomie
    .selectAll("text").style("stroke", colorHcSum); // kolor napisów



  // Y counters
  var yCntScale = d3
    .scaleSqrt()
    .domain(d3.extent(data, (d) => d.hwcEnergyCnt))
    .range([drawSize.height, margin.top]);

  var yCntAxis = d3.axisRight()
    .scale(yCntScale)
    .tickFormat(d3.format(".3s")); // format naukowy z 3 cyframi

  chart.append("g").call(yCntAxis)
    .attr("transform", `translate(${drawSize.width},0)`)
    .selectAll("text").style("stroke", colorHcCnt);

  //kreskowane ticks
  chart.selectAll("line")
    .style("stroke", "grey")
    .style("stroke-dasharray", "4,4")


  // hwcEnergySum
  let hwcEnergySum = 
    chart.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", colorHwcSum)
    .attr("stroke-width", 2.5)
    .attr("d", d3.line()
      .x(d => xScale(d.date))
      .y(d => ySumScale(d.hwcEnergySum)));

  // hcEnergyCnt
  let hcEnergyCnt = 
    chart.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", colorHcCnt)
    .attr("stroke-width", 2.5)
    .attr("d", d3.line()
      .x((d) => xScale(d.date))
      .y((d) => yCntScale(d.hcEnergyCnt)));

  // hwcEnergyCnt
  let hwcEnergyCnt = 
    chart.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", colorHwcCnt)
    .attr("stroke-width", 2.5)
    .attr("d", d3.line()
      .x((d) => xScale(d.date))
      .y((d) => yCntScale(d.hwcEnergyCnt))
    );



  // Legend
  chart.append("circle").attr("cx", margin.left).attr("cy", 20).attr("r", 6).style("fill", colorHcSum)
  chart.append("circle").attr("cx", margin.left).attr("cy", 40).attr("r", 6).style("fill", colorHcCnt)
  chart.append("circle").attr("cx", margin.left).attr("cy", 60).attr("r", 6).style("fill", colorHwcSum)
  chart.append("circle").attr("cx", margin.left).attr("cy", 80).attr("r", 6).style("fill", colorHwcCnt)
  chart.append("text").attr("x", margin.left + 10).attr("y", 25).text("hcEnergyCnt").style("font-size", "15px").attr("alignment-baseline", "middle")
  chart.append("text").attr("x", margin.left + 10).attr("y", 45).text("hcEnergySum").style("font-size", "15px").attr("alignment-baseline", "middle")
  chart.append("text").attr("x", margin.left + 10).attr("y", 65).text("hwcEnergyCnt").style("font-size", "15px").attr("alignment-baseline", "middle")
  chart.append("text").attr("x", margin.left + 10).attr("y", 85).text("hwcEnergySum").style("font-size", "15px").attr("alignment-baseline", "middle")





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
   hwcEnergySum.attr("d", d3.line()
     .x(d => xz(d.date))
     .y(d => ySumScale(d.hwcEnergySum)));

   hcEnergyCnt.attr("d", d3.line()
     .x(d => xz(d.date))
     .y(d => yCntScale(d.hcEnergyCnt)));

   hwcEnergyCnt.attr("d", d3.line()
     .x(d => xz(d.date))
     .y(d => yCntScale(d.hwcEnergyCnt)));

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


