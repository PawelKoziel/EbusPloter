const promise = new Promise(
    (resolve, reject) => {
        let value = true //tu operacja wymagająca czasu
        if (value) {
            resolve('hey value is true')
        } else {
            reject('there was an error')
        }
})

//użycie
// 1 sposób:
promise
    .then((x) => {
        console.log(x)
    })
    .catch((err) => console.log(err))

//2 sposób:
async function asyncCall() {
    const result = await promise
    console.log(result)
}

asyncCall()
