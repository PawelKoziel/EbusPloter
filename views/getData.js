//const apiRoot = `http://${settings.interface}:${settings.port}/api/`
const apiRoot = 'http://localhost:3001/api/'


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

