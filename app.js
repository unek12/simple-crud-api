require('dotenv').config()
const http = require('http')
const uuid = require('uuid')
const PORT = process.env.PORT
const { inputValidator } = require('./src/inputValidator')
const db = {}

const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
    res.setHeader('Access-Control-Allow-Origin', '*')
    const { url, method } = req
    const urlSegments = url.split('/').splice(1)
    switch (urlSegments[0]) {
        case 'person': {
            if (method === 'GET') {
                if (urlSegments[1]) {
                    if (urlSegments[1] in db) {
                        res.writeHead(200, {'Content-Type': 'text/json'})
                        res.end(JSON.stringify(db[urlSegments[1]]))
                    } else {
                        res.writeHead(404, {'Content-Type': 'text/json'})
                        res.end(JSON.stringify({status: 404, message: `Item with id ${urlSegments[1]} not found`}))
                    }
                    return
                }
                res.writeHead(200, {'Content-Type': 'text/json'})
                res.end(JSON.stringify(db))
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
                console.log('put')
                res.end()
            }
            console.log(method)
            if (method === 'DELETE') {
                if (urlSegments[1] in db) {
                    delete db[urlSegments[1]]
                    res.end(JSON.stringify({status: 202 ,message: `Item with id ${urlSegments[1]}`}))
                } else {
                    res.end(JSON.stringify({status: 404, message: `Item with id ${urlSegments[1]} not found`}))
                }
            }
            if (method === 'OPTIONS') {
                const headers = {};
                headers["Access-Control-Allow-Origin"] = "*"
                headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS"
                headers["Access-Control-Allow-Credentials"] = false
                headers["Access-Control-Max-Age"] = '86400'
                headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
                res.writeHead(200, headers);
                res.end();
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