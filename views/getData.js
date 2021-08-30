//var config = require("../config.json");

//const apiRoot = `http://${config.interface}:${config.port}/api/`
const apiRoot = 'http://127.0.0.1:3001/api/'


export function getData(path){
    return new Promise(function (resolve, reject) {
        d3.json(apiRoot + path, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data)
          }
        });
      });
}

