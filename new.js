const HTTPS = require('https');
const HTTP = require('http');

const port = process.env.PORT || 3000

HTTPS
    .get( 'https://catfact.ninja/fact', res  =>  {
        let data = ''
        res.on('data', chunks  =>  data += chunks )

        res.on( 'end' , () => {
            let parsedData = JSON.parse(data)
            console.log(parsedData)
            const server = HTTP.createServer((req, res) => {
                 res.statusCode = 200;
                 res.setHeader('Content-Type', 'text/html');
                 res.setHeader('Access-Control-Allow-Origin', '*')
                 res.end(JSON.parse(data).fact);
            })

            server.listen(port, () => console.log(
                `Server running on port ${port}`
            ));

        })
    })
    .on('error', err => {
        console.log("Error: ", err.message)
    })