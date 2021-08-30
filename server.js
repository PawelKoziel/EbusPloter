// Create express app
var express = require("express");
var app = express();
const cors = require('cors');
var config = require("./config.json");
var sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = 'vaillant.db';

app.engine(".html", require("ejs").__express);
app.set("views", [path.join(__dirname, "views")]);//, path.join(__dirname, "panZoom")]);
app.set("view engine", "html");
app.use(express.static("views"));

app.use(cors())


const ip = config.interface;
const port = config.port;

var apiAddress = `http://${ip}:${port}`

// Start server
app.listen(port, config.interface, 
  () => console.log(apiAddress));

// main www  
app.get("/", function (req, res) {
  res.render("plotTemp", {json: "ddddddddd"});
});

// temp API
app.get("/api/temps", (req, res) => {
  var sql = "select * from temps";
  getDbData(sql, req, res);
});

// param API
app.get("/api/parms", (req, res) => {
  var sql = "select * from params";
  getDbData(sql, req, res);
});

// energy API
app.get("/api/energy", (req, res) => {
  var sql = "select * from energy";
  getDbData(sql, req, res);
});


function getDbData(sql, req, res) {
  let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the Vaillant database.");
  });
  db.all(sql, (err, row) => {
    res.json(row);
  });
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
}

module.exports = app;
// app.get("/a", function (req, res) {
//   res.render("index");
// });


// app.get("/d3test", function (req, res) {
//   var temperatureList = [];
//   var sql = "select * from temps";
//   var params = [];
//   db.all(sql, params, (err, rows) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }
//     for (var i = 0; i < rows.length; i++) {
//       var temperature = {
//         id: rows[i].id,
//         date: rows[i].date,
//         indoor: rows[i].indoor,
//         outdoor: rows[i].outdoor,
//         hwcWater: rows[i].hwcWater,
//       };
//       temperatureList.push(temperature);
//     }
//     console.log(`Got ${temperatureList.length} results`);
//     //res.render('testtable', {"temperatureList": temperatureList});
//     res.render("plotTemp", { temperatureList: temperatureList });
//   });
// });

// Return HTTP
// app.get('/',function(req,res){
//     res.sendFile(path.join(__dirname+'/index.html'));
//     //__dirname : It will resolve to your project folder.
//   });

// Root endpoint
// app.get("/", (req, res, next) => {
//     res.json({"message":"Ok"})
// });

// Default response for any other request
// app.use(function (req, res) {
//   res.status(404);
// });
  // db.all(sql, params, (err, rows) => {
  //   if (err) {
  //     res.status(400).json({ error: err.message });
  //     return;
  //   }
  //   res.json({
  //     data: rows,
  //   });
  // });
  // db.close();
  // var temperatureList = [];
  // db.all(sql, params, (err, rows) => {
  //   if (err) {
  //     res.status(400).json({ error: err.message });
  //     return;
  //   }
  //   for (var i = 0; i < rows.length; i++) {
  //     var temperature = {
  //       id: rows[i].id,
  //       date: rows[i].date,
  //       indoor: rows[i].indoor,
  //       outdoor: rows[i].outdoor,
  //       hwcWater: rows[i].hwcWater,
  //     };
  //     temperatureList.push(temperature);
  //   }
  //   res.json(temperatureList);
  //   db.close();
  //   console.log(`Got ${temperatureList.length} results`);
  // });

  //let db = new sqlite3.Database(DBSOURCE, (err) => {