const { join } = require('path')
const fs = require('fs')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000
app.use(cors())

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static(join(__dirname, 'public')))

fs.readFile(join(__dirname, '.env'), 'utf-8', (err, data) => {
    if (!err) {
        require('dotenv').config()
    }

    let dsn = process.env.ATLAS_URI

    if (dsn) {
        mongoose.connect(dsn, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })

        mongoose.connection.once('open', err => {
            if (err) throw err;
        })
    }
})

const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')

app.use('/user', userRouter)
app.use('/auth', authRouter)

app.listen(PORT, () => console.log(`server is listening on http://localhost:${PORT}`))