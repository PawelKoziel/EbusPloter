const apiRoot = 'http://localhost:3001/api/'

export function getTempData(path){
    return new Promise(function (resolve, reject) {
        d3.json(apiRoot + path, function (err, data) {
          if (err) {
            reject(error);
          } else {
            resolve(data)
          }
        });
      });
}


export function getParmData(path){
  return new Promise(function (resolve, reject) {
      d3.json(apiRoot + path, function (err, data) {
        if (err) {
          reject(error);
        } else {
          resolve(data)
        }
      });
    });
}

