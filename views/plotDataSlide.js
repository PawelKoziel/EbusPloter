
  height = 500
  margin = ({top: 20, right: 20, bottom: 30, left: 30})

  
  
  
  const minX = x(data[0].date);
  const maxX = x(data[data.length - 1].date);
  const overwidth = maxX - minX + margin.left + margin.right;

  const parent = d3.create("div");

  parent.append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("z-index", 1)
      .call(svg => svg.append("g").call(yAxis));

  const body = parent.append("div")
      .style("overflow-x", "scroll")
      .style("-webkit-overflow-scrolling", "touch");

  body.append("svg")
      .attr("width", overwidth)
      .attr("height", height)
      .style("display", "block")
      .call(svg => svg.append("g").call(xAxis))
    .append("path")
      .datum(data)
      .attr("fill", "steelblue")
      .attr("d", area);

  yield parent.node();

  // Initialize the scroll offset after yielding the chart to the DOM.
  body.node().scrollBy(overwidth, 0);



  x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width * 6 - margin.right])

  y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice(6)
    .range([height - margin.bottom, margin.top])

    xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(d3.utcDay.every(1200 / width)).tickSizeOuter(0))

    yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(6))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y))


        d3.json("http://localhost:3001/api/temps", 
        function (temps) {
         let data = temps;
         console.log(data);
         console.log("id:", data[0].id);
         console.log("value:", data[0].outdoor);