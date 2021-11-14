// Create express app
var express = require("express");
var app = express();
const cors = require('cors');
var config = require("./config.json");
var sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = 'vaillant.db';

const pageSize = 1008; // a week
const ip = config.interface;
const port = config.port;

app.engine(".html", require("ejs").__express);
app.set("views", [path.join(__dirname, "views")]);//, path.join(__dirname, "panZoom")]);
app.set("view engine", "html");
app.use(express.static("views"));
app.use('/favicon.ico', express.static('favicon.ico'));
app.use(cors())

var apiAddress = `http://${ip}:${port}`


// Start server
app.listen(port, ip, () => console.log(apiAddress));

// main www  
app.get("/", function (req, res) {
  res.render("plotTemp", { json: "ddddddddd" });
});

// temp API
app.get("/api/temps", (req, res) => {
  let sql = 'SELECT id, date, indoor, outdoor, hwcWater FROM temps ORDER BY id DESC';
  if (req.query.page !== undefined && !isNaN(req.query.page)) {
    let page = req.query.page - 1;
    sql += ` LIMIT ${pageSize} OFFSET ${page * pageSize}`
  }
  getDbData(sql, res);
});


// param API
app.get("/api/parms", (req, res) => {
  let sql = 'SELECT * FROM params ORDER BY id DESC';
  if (req.query.page !== undefined && !isNaN(req.query.page)) {
    let page = req.query.page - 1;
    sql += ` LIMIT ${pageSize} OFFSET ${page * pageSize}`
  }
  getDbData(sql, res);
});

// energy API
app.get("/api/energy", (req, res) => {
  //let sql = "SELECT e.Date, MAX(e.HcEnergySum) - MIN(e.HcEnergySum) as HcUsage, MAX(e.HwcEnergySum) - MIN(e.HwcEnergySum) as HwcUsage FROM Energy AS e GROUP BY CAST(strftime('%Y', e.Date) AS INTEGER), CAST(strftime('%m', e.Date) AS INTEGER), CAST(strftime('%d', e.Date) AS INTEGER)"

  let sql = "SELECT e.Date, MAX(e.HcEnergyCnt) - MIN(e.HcEnergyCnt) as HcUsage, MAX(e.HwcEnergyCnt) - MIN(e.HwcEnergyCnt) as HwcUsage FROM Energy AS e GROUP BY CAST(strftime('%Y', e.Date) AS INTEGER), CAST(strftime('%m', e.Date) AS INTEGER), CAST(strftime('%d', e.Date) AS INTEGER)"

  // if (req.query.page !== undefined && !isNaN(req.query.page)) {
  //   let page = req.query.page -1;  
  //   sql += ` LIMIT ${pageSize} OFFSET ${page * pageSize}`
  // }
  getDbData(sql, res);
});



function getDbData(sql, res) {
  let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the Vaillant database.");
  });

  db.all(sql, (err, row) => res.json(row));

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
}



function getDbData2(sql, res) {
  let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the Vaillant database.");
  });

  db.all(sql, (err, row) => {

    if (err) {
      return console.error(err.message);
    }

    let outArr = new Array();
    let i = 0;
    row.forEach(element => {
      
    });
    
    for (let i = 0; i < row.length; i++) {
      if (row[i].hwcEnergyCnt != row[i + 1].hwcEnergyCnt) {
        outArr.push(row)
      }
    }
    res.json(outArr)
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
}


function getDbDataParm(sql, parms, res) {
  let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the Vaillant database.");
  });

  let sqlQuery = 'SELECT id, date, indoor, outdoor, hwcWater FROM ? ORDER BY id DESC';
  if (parms.length > 1) {
    sqlQuery = + ' LIMIT ? OFFSET ?'
  }

  let sqlW = db.prepare(sqlQuery);
  sqlW.run(parms, (err, row) => res.json(row))

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