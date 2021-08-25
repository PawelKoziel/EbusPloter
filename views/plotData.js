      // set the dimensions and margins of the graph
      var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 1200 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3
        .select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //Read the data
      d3.json("http://localhost:3001/api/temps", 
       function (temps) {
        let data = temps;
        console.log(data);
        console.log("id:", data[0].id);
        console.log("value:", data[0].outdoor);

        // Add Y axis
        var x = d3
          .scaleLinear()
          .domain(d3.extent(data, (d) => d.id))
          .range([0, width]);
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3
          .scaleLinear()
          .domain([
            0,
            d3.max(data, (d) => Math.max(d.outdoor, d.indoor, d.hwcWater)) + 2,
          ])
          .range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        // Create the circle that travels along the curve of chart
        var focus = svg
          .append("g")
          .append("circle")
          .style("fill", "none")
          .attr("stroke", "black")
          .attr("r", 8.5)
          .style("opacity", 0);

        // Create the text that travels along the curve of chart
        var focusText = svg
          .append("g")
          .append("text")
          .style("opacity", 0)
          .attr("text-anchor", "left")
          .attr("alignment-baseline", "middle");

        const hwcMin = d3.min(data, (d) => +d.hwcWater);
        const hwcMax = d3.max(data, (d) => +d.hwcWater);
        console.log("min:", hwcMin, ", max: ", hwcMax);

        // Set the gradient
        svg
          .append("linearGradient")
          .attr("id", "line-gradient")
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", 0)
          .attr("y1", y(hwcMin))
          .attr("x2", 0)
          .attr("y2", y(hwcMax))
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

        // Add the line
        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "#33cc66")
          .attr("stroke-width", 2.5)
          .attr(
            "d",
            d3
              .line()
              .x((d) => x(d.id))
              .y((d) => y(d.outdoor))
          );

        // indoor
        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "#da7c20")
          .attr("stroke-width", 2.5)
          .attr(
            "d",
            d3
              .line()
              .x((d) => x(d.id))
              .y((d) => y(d.indoor))
          );

        //hwc Water
        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "url(#line-gradient)") //add gradient to hwcWater
          .attr("stroke-width", 2.5)
          .attr(
            "d",
            d3
              .line()
              .x((d) => x(d.id))
              .y((d) => y(d.hwcWater))
          );

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg
          .append("rect")
          .style("fill", "none")
          .style("pointer-events", "all")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseout", mouseout);


        // This allows to find the closest X index of the mouse:
        var bisect = d3.bisector(d => d.id).left;


        // What happens when the mouse move -> show the annotations at the right positions.
        function mouseover() {
          focus.style("opacity", 1);
          focusText.style("opacity", 1);
        }

        function mousemove() {
          // recover coordinate we need
          var x0 = x.invert(d3.mouse(this)[0]);
          var i = bisect(data, x0, 1);
          selectedData = data[i];
          focus.attr("cx", x(selectedData.id)).attr("cy", y(selectedData.hwcWater));
          focusText
            .html("id:" + selectedData.id + "  -  " + "temp:" + selectedData.hwcWater)
            .html("temp:" + selectedData.hwcWater)
            .attr("x", x(selectedData.id) + 15)
            .attr("y", y(selectedData.hwcWater));
        }

        function mouseout() {
          focus.style("opacity", 0);
          focusText.style("opacity", 0);
        }
      });