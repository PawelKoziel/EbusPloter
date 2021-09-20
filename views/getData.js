//var config = require("../config.json");

//const apiRoot = `http://${config.interface}:${config.port}/api/`
const apiRoot = 'http://127.0.0.1:3001/api/'




export function getData(path){
    return new Promise((resolve, reject) => {
        d3.json(apiRoot + path, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data)
          }
        });
      });
}

// function main() {
//   d3.json('http://127.0.0.1:3001/api/energy')
//     //getData('energy')
//     .then(data => drawChart(data))
//     .catch(error => console.log(error))
// }


