import { getTempData } from './getData.js'

function main() {
    getTempData()
        .then(
            data => {
                drawChart(data);
            })
        .catch(
            error => console.log(error)
        )
}

main();



function drawChart(data) {
    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40,
    },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var zones;

    var x = d3.scale
        .linear()
        .domain([-width / 2, width / 2])
        .range([width, 0]);
    var y = d3.scale
        .linear()
        .domain([-height / 2, height / 2])
        .range([height, 0]);
    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(-height);
    var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5).tickSize(-width);
    var zoom = d3.behavior
        .zoom()
        .x(x)
        .y(y)
        .scaleExtent([-50, 50])
        .on("zoom", zoomed);
    
        var svg = d3
        .select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);
    
        svg
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    
        var rect = svg.append("rect").attr("width", width).attr("height", height);
    
    svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g").attr("class", "y axis").call(yAxis);

    function ObjectId(s) {
        return s;
    }




    function updateGraphData(data) { }

    // TODO Figure out how to select selZone and add the zone options to it using d3 map maybe.
    function selZone_Changed(d) {
        var value = d3.select(this).property("value");
        getSpawnData(value, updateGraphData);
    }

    var selZone = d3.select("#selZone").on("change", selZone_Changed);

    selZone
        .selectAll("option")
        .data(zones)
        .enter()
        .append("option")
        .attr("value", function (d) {
            return d.ID;
        })
        .text(function (d) {
            return d.Name + " " + d.DisplayName;
        });

    function getSpawnData(zoneID) { }

    function SpawnGroup() {
        this.type = "group";
        this.shape = "rect";

        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.spawns = [];
    }

    var spawns = [];

    SpawnGroup.prototype.add = function SpawnGroup__add(id, amount) {
        this.spawns.push({ id: id, amount: amount });
    };

    function SpawnPoint() {
        this.type = "point";
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.spawns = [];
    }

    SpawnPoint.prototype.add = function SpawnPoint__add(id, direction) {
        this.spawns.push({ id: id, direction: direction });
    };

    // //aaa
    // var data;


    // d3.json("player.json", function (err, datas) {
    //     data = datas;
    // });



    //updateGraphData(data);
    var circles = svg
        .append("g")
        .attr("clip-path", "url(#clip)")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .on("mouseover", function () {
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function (d) {
            set_tooltip_label(d);
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
        });
    var mobColours = d3.scale.category20b();
    var circleAttributes = circles
        .attr("cx", function (d) {
            return x(d.x);
        })
        .attr("cy", function (d) {
            return y(d.z);
        })
        .attr("r", function (d) {
            return 20;
        })
        .style("fill", function (d) {
            switch (d.type) {
                case "mon": {
                    return "red";
                    break;
                }
                case "npc":
                    return "blue";
                    break;
                case "player":
                    return "green";
                    break;
            }
        });

    d3.select("button").on("click", reset);

    function zoomed() {
        // TODO: Togglable zoom, should only drag/zoom when not holding shift key.
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        circles.attr(
            "transform",
            "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
        );
    }

    function reset() {
        svg.call(
            zoom
                .x(x.domain([-width / 2, width / 2]))
                .y(y.domain([-height / 2, height / 2])).event
        );
    }



    function getDateTimeFromObjectID(_id) {
        var timestamp = _id.toString().substring(0, 8);
        return new Date(parseInt(timestamp, 16) * 1000);
    }

    var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "plan_tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("");
    set_tooltip_label = function (d) {
        var dt = getDateTimeFromObjectID(d._id);
        tooltip.html(
            "<strong>Type:</strong> " +
            d.type +
            "<br><strong>ID:</strong>: " +
            d.id +
            " <strong>Unique ID:</strong> " +
            d.uniqueID1 +
            "<br><strong>Location:</strong> (" +
            d.x.toFixed(2) +
            ", " +
            d.y.toFixed(2) +
            ", " +
            d.z.toFixed(2) +
            ")<br><strong>Logged On:</strong> " +
            dt.toLocaleDateString() +
            " at " +
            dt.toLocaleTimeString()
        );
        if (!(event === undefined)) {
            tooltip
                .style("top", event.pageY - 10 + "px")
                .style("left", event.pageX + 10 + "px");
        }
    };
}