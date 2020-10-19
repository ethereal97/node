const { join } = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static(join(__dirname, 'public')))

const router = require('./src/router')

router(app);


app.listen(PORT, () => console.log(`server is listening on port ${PORT}`))