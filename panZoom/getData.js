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


const words = ['react', 'script', 'interview', 'style']
const ans = words.filter((w) => w.length > 6)
console.log(ans)
