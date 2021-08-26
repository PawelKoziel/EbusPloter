(function () {
  var margin = { top: 30, right: 20, bottom: 20, left: 40 };
  var width = 960 - margin.left - margin.right;
  var height = 300 - margin.top - margin.bottom;
  var scrollableWidth = width * 2;

  var stringifyDatetime = d3.time.format("%Y-%m-%dT%H:%M:%S");
  var parseDatetime = stringifyDatetime.parse;
  var formatXAxis = d3.time.format("%b %d %I%p");

  var xScale = d3.time.scale().range([0, scrollableWidth]);

  var yScale = d3.scale.linear().range([height, 0]);

  var zoom = d3.behavior
    .zoom()
    .scaleExtent([1, 1]) // Only allow translations
    .on("zoom", onZoom);

  var svg;
  var scrollable;

  function create(selector) {
    selector = selector || "body";

    svg = d3
      .select(selector)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      // Important to listen for "zoom" events on a fixed element,
      // else you get a jitter/shake effect
      // http://stackoverflow.com/questions/12674872/d3-force-layout-making-pan-on-drag-zoom-smoother
      .call(zoom);

    svg
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("x", 0)
      // Stretch to cover x axis
      .attr("y", -margin.top)
      .attr("width", width)
      .attr("height", height + margin.top);

    svg.append("g").attr("class", "y axis").attr("transform", "translate(0,0)");

    var scrollableViewBox = svg.append("g").attr("clip-path", "url(#clip)");

    scrollable = scrollableViewBox
      .append("g")
      .attr("width", scrollableWidth)
      .attr("class", "scrollable");

    scrollable
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0,0)");
  }

  // Hooks to do things on certain chart events
  var handlers = {
    onTranslate: function () {},
    onClickPagingButton: function () {},
  };

  function setHandlers(newHandlers) {
    _.extend(handlers, newHandlers);
  }

  function draw(state) {
    var start = state.start;
    var end = state.end;
    var location = state.location || start;
    var data = state.data;
    var loading = state.loading;

    updateSvg(loading);
    updateScales(start, end, data);
    drawAxis();
    drawFill();
    drawPagingButtons(loading);

    // No need to re-draw data points when loading, useless computation
    if (!loading) {
      drawDataPoints(data);
    }

    setDatetimeLocation(location);
  }

  function updateSvg(loading) {
    // Used by the 'zoom' event handler
    svg.data([{ loading: loading }]);
  }

  function updateScales(start, end, data) {
    xScale.domain([parseDatetime(start), parseDatetime(end)]);

    var yMax = 300;
    if (data && data.length) {
      // Only update y domain if we really need to (i.e. data over a big value)
      // To avoid changing scales too often (user looses bearings)
      var dataMax =
        d3.max(data, function (d) {
          return d.value;
        }) + 20;
      yMax = d3.max([yMax, dataMax]);
    }
    yScale.domain([0, yMax]);
  }

  function drawAxis() {
    var xAxis = d3.svg
      .axis()
      .scale(xScale)
      .orient("top")
      .tickPadding(6)
      .tickFormat(formatXAxis);

    var yAxis = d3.svg.axis().scale(yScale).orient("left").tickPadding(6);

    svg.select(".x").call(xAxis);
    svg.select(".y").call(yAxis);
  }

  function drawFill() {
    var g = scrollable.selectAll("g.fill-group").data(["1"]);

    g.enter().append("g").attr("class", "fill-group");

    var fill = g.selectAll(".fill").data(["1"]);

    fill
      .enter()
      .append("rect")
      .attr("class", "fill")
      .attr("width", scrollableWidth)
      .attr("height", height);
  }

  function drawPagingButtons(loading) {
    var buttonWidth = 100;

    var buttons = [
      { name: "left", loading: loading, x: -buttonWidth },
      { name: "right", loading: loading, x: scrollableWidth },
    ];

    var button = scrollable.selectAll("g.paging-button").data(buttons);

    var buttonEnter = button
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return "translate(" + d.x + ",0)";
      })
      .on("click", onClickPagingButton);
    buttonEnter
      .append("rect")
      .attr("class", "paging-button-fill")
      .attr("width", buttonWidth)
      .attr("height", height);
    buttonEnter
      .append("text")
      .attr("class", "paging-button-text")
      .attr("x", buttonWidth / 2)
      .attr("y", height / 2)
      .attr("dy", "0.32em")
      .attr("text-anchor", "middle");

    button
      .attr("class", function (d) {
        var className = "paging-button";
        if (d.loading) {
          className = className + " paging-button-loading";
        }
        return className;
      })
      .select(".paging-button-text")
      .text(function (d) {
        return d.loading ? "Loading..." : "More";
      });
  }

  function drawDataPoints(data) {
    var stroke = 0;
    var radius = 3;

    var g = scrollable.selectAll("g.data-points").data(["1"]);

    g.enter().append("g").attr("class", "data-points");

    var dataPoint = g.selectAll(".data-point").data(data, idKey);

    dataPoint
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .attr("stroke-width", stroke);

    dataPoint
      .attr("cx", function (d) {
        return xScale(getX(d));
      })
      .attr("cy", function (d) {
        return yScale(d.value);
      })
      .attr("r", radius);

    dataPoint.exit().remove();
  }

  function idKey(d) {
    return d.id;
  }

  function getX(d) {
    return parseDatetime(d.datetime);
  }

  function onZoom(d) {
    if (d.loading) {
      return;
    }

    var e = d3.event;
    var dx = e.translate[0];
    scrollable.attr("transform", "translate(" + dx + ",0)");

    handlers.onTranslate({
      location: getDatetimeLocation(),
    });
  }

  function onClickPagingButton(d) {
    if (d.loading) {
      return;
    }

    handlers.onClickPagingButton({
      name: d.name,
      location: getDatetimeLocation(),
    });
  }

  // Programatically set left edge to given datetime
  function setDatetimeLocation(datetime) {
    // Need to set new translate value on `zoom`
    // and then fire event on element listening to zoom events (svg in our case)
    // We can't apply transform directly or else `zoom` will loose track of
    // where it was
    var dx = -xScale(getX({ datetime: datetime }));
    zoom.translate([dx, 0]);
    zoom.event(svg);
  }

  // Get datetime value left edge is currently "located" at
  function getDatetimeLocation() {
    var dx = zoom.translate()[0];
    var datetime = xScale.invert(-dx);
    datetime = stringifyDatetime(datetime);
    return datetime;
  }

  window.chart = {
    create: create,
    setHandlers: setHandlers,
    draw: draw,
  };
})();
