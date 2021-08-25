var sqlite3 = require("sqlite3").verbose();
var md5 = require("md5");

const DBSOURCE = "vaillant.db";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the chinook database.");
});

// db.serialize((res) => {
//   db.each(
//     `SELECT PlaylistId as id,
//                         Name as name
//                  FROM playlists`,
//     (err, row) => {
//       if (err) {
//         console.error(err.message);
//       }
//       res.json({
//         data: rows,
//       });
//       //console.log(row.id + "\t" + row.name);
//     }
//   );
// });




db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Close the database connection.");
});

module.exports = db;
