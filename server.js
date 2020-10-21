const { join } = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const server = http.createServer(app)

require('dotenv').config()

const PORT = process.env.PORT || 3000

app.use(cors())

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static(join(__dirname, 'public')))

mongoose.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
})

const db = mongoose.connection
const router = require('./src/router')

router(app, db);

app.listen(PORT, () => console.log(`server is listening on port ${PORT}`))