// Create express app
var express = require("express");
var app = express();
var db = require("./database.js");
var settings = require('./package.json');

const path = require('path');

// PUG
// app.set('view engine','pug');

app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'html');
app.use(express.static('views'))

// Start server
app.listen(settings.port, () => {
    console.log("http://localhost:%PORT%".replace("%PORT%",settings.port))
});


// Insert here other API endpoints
app.get("/api/temps", (req, res, next) => {
    var sql = "select * from temps"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
          res.json({
              "data":rows
          })
      });
      //db.connection.end();
});

app.get('/',function(req, res) {
  res.render('plotTemp')
  //res.sendFile(path.join(__dirname,'views','plotTemp.html'))
});

app.get('/d3test',function(req, res) {
  var temperatureList = [];
  var sql = "select * from temps"
  var params = []
  db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      for (var i = 0; i < rows.length; i++) {
        var temperature = {
          'id':rows[i].id,
          'date':rows[i].date,
          'indoor':rows[i].indoor,
          'outdoor':rows[i].outdoor,
          'hwcWater':rows[i].hwcWater
        }
        temperatureList.push(temperature);
      }
      console.log(`Got ${temperatureList.length} results`)
      //res.render('testtable', {"temperatureList": temperatureList});  
      res.render('plotTemp', { temperatureList: temperatureList });   
  })
});

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
app.use(function(req, res){
    res.status(404);
});
