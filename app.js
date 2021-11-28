require('dotenv').config()
const http = require('http')
const uuid = require('uuid')
const PORT = process.env.PORT || 8080
const { inputValidator } = require('./src/inputValidator')
const db = {}
const server = http.createServer(async (req, res) => {
    const { url, method } = req
    const urlSegments = url.split('/').splice(1)
    res.setHeader("Access-Control-Allow-Origin", "*")
    if (method === 'OPTIONS') {
        const headers = {};
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS"
        headers["Access-Control-Allow-Credentials"] = false
        headers["Access-Control-Max-Age"] = '86400'
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
        res.writeHead(200, headers);
        return  res.end();
    }
    switch (urlSegments[0]) {
        case 'person': {
            if (method === 'GET') {
                if (urlSegments[1]) {
                    if (!uuid.validate(urlSegments[1])) {
                        res.writeHead(400, {'Content-Type': 'text/json'})
                        return res.end(JSON.stringify({message: `Not valid id`}))
                    }
                    if (urlSegments[1] in db) {
                        res.writeHead(200, {'Content-Type': 'text/json'})
                        return res.end(JSON.stringify(db[urlSegments[1]]))
                    } else {
                        res.writeHead(404, {'Content-Type': 'text/json'})
                        return res.end(JSON.stringify({message: `Item with id ${urlSegments[1]} not found`}))
                        }
                    }
                res.writeHead(200, {'Content-Type': 'text/json'})
                return res.end(JSON.stringify(db))
            }
            if (method === 'POST') {
                if (!urlSegments[1]) {
                    req.on('data', chunk => {
                        if (inputValidator(JSON.parse(chunk.toString()))) {
                            const key = uuid.v1()
                            db[key] = JSON.parse(chunk.toString())
                            res.writeHead(201, {'Content-Type': 'text/json'})
                            return res.end(JSON.stringify(db[key]))
                        } else {
                            res.writeHead(400, {'Content-Type': 'text/json'})
                            return res.end(JSON.stringify({message: `Does not contain all required fields`}))
                        }
                    })
                } else {
                    res.writeHead(404, {'Content-Type': 'text/json'})
                    return res.end(JSON.stringify({message: `Resource not found 1`}))
                }
            }
            if (method === 'PUT') {
                if (urlSegments[1]) {
                    if (!uuid.validate(urlSegments[1])) {
                        res.writeHead(400, {'Content-Type': 'text/json'})
                        return res.end(JSON.stringify({message: `Not valid id`}))
                    }
                    if (urlSegments[1] in db) {
                        req.on('data', chunk => {
                            if (inputValidator(JSON.parse(chunk.toString()))) {
                                db[urlSegments[1]] = JSON.parse(chunk.toString())
                                res.writeHead(200, {'Content-Type': 'text/json'})
                                return res.end(JSON.stringify(db[urlSegments[1]]))
                            } else {
                                res.writeHead(404, {'Content-Type': 'text/json'})
                                return res.end(JSON.stringify({message: `Item with id ${urlSegments[1]} not found`}))
                            }
                        })
                    }
                } else {
                    res.writeHead(404, {'Content-Type': 'text/json'})
                    return res.end(JSON.stringify({message: `Resource not found`}))
                }
            }
            if (method === 'DELETE') {
                if (urlSegments[1]) {
                    if (!uuid.validate(urlSegments[1])) {
                        res.writeHead(400, {'Content-Type': 'text/json'})
                        return res.end(JSON.stringify({message: `Not valid id`}))
                    }
                    if (urlSegments[1] in db) {
                        delete db[urlSegments[1]]
                        res.writeHead(204, {'Content-Type': 'text/json'})
                        return res.end()
                    } else {
                        res.writeHead(404, {'Content-Type': 'text/json'})
                        return res.end(JSON.stringify({message: `Item with id ${urlSegments[1]} not found`}))
                    }
                }

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