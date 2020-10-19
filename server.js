const { join } = require('path')
const http = require('http')
const express = require('express')

const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 3000;

const router = require('./src/router')

router(app);

app.use(express.static(join(__dirname, 'public')))

app.listen(PORT, () => console.log(`server is listening on port ${PORT}`))
