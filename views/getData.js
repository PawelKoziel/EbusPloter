const apiPath = 'http://localhost:3001/api/temps'

export function getTempData(){
    return new Promise(function (resolve, reject) {
        d3.json(apiPath, function (err, data) {
          if (err) {
            reject(error);
          } else {
            resolve(data)
          }
        });
      });
}






  
