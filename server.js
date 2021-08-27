// Create express app
var express = require("express");
var app = express();
var settings = require("./package.json");
var sqlite3 = require("sqlite3").verbose();
const path = require("path");


app.engine(".html", require("ejs").__express);
app.set("views", [path.join(__dirname, "views")]);//, path.join(__dirname, "panZoom")]);
app.set("view engine", "html");
app.use(express.static("views"));
//app.use(express.static("panZoom"));

// Start server
app.listen(settings.port, () => {
  console.log("http://localhost:%PORT%".replace("%PORT%", settings.port));
});

// Insert here other API endpoints
app.get("/api/temps", (req, res) => {
  var sql = "select * from temps";

  let db = new sqlite3.Database(path.resolve("vaillant.db"), (err) => {
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
});


app.get("/api/parms", (req, res) => {
  var sql = "select * from params";

  let db = new sqlite3.Database(path.resolve("vaillant.db"), (err) => {
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
});



app.get("/", function (req, res) {
  res.render("plotTemp");
});


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