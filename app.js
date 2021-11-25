require('dotenv').config()
const http = require('http')
const cors = require('cors')
const uuid = require('uuid')
const PORT = process.env.PORT
const { inputValidator } = require('./src/inputValidator')
const db = {}
cors()

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { url, method } = req
    const urlSegments = url.split('/').splice(1)
    switch (urlSegments[0]) {
        case 'person': {
            if (method === 'GET') {
                res.writeHead(200, {'Content-Type': 'text/json'})
                if (urlSegments[1]) {
                    return res.end(JSON.stringify(db[urlSegments[1]]))
                }
                return res.end(JSON.stringify(db))
            }
            if (method === 'POST') {
                req.on('data', chunk => {
                    if (inputValidator(JSON.parse(chunk.toString()))) {
                        res.writeHead(200, {'Content-Type': 'text/json'})
                        const key = uuid.v1()
                        db[key] = JSON.parse(chunk.toString())
                        return res.end(JSON.stringify(db[key]))
                    }
                })
            }
            if (method === 'PUT') {

            }
            console.log(method)
            if (method === 'DELETE') {
                console.log(urlSegments)
                delete db[urlSegments[2]]
                res.end(JSON.stringify({message: `Item with id ${urlSegments[2]}`}))
            }
            if (method === 'OPTIONS') {
                res.setHeader('Origin', 'file:///D:/learning/task_3_client/index.html');
                res.setHeader('Access-Control-Allow-Credentials', 'true');

                res.end()
            }
            break
        }

        default: {
            res.writeHead(404, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: 'resource not found'}))
        }
    }
})

server.listen(PORT, () => {
    console.log(`Server has been stated on PORT ${PORT}`)
})