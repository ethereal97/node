const users = require('./users');
const cookie = require('./cookie');
const uuid = require('uuid').v4;

module.exports = function router(app) {
    app.get('/timestamp', (req, res) => {
        res.send((new Date).getTime().toString().slice(0, -3))
        res.end()
    })

    app.get('/users', (req, res) => {
        res.json(users.getAll())
        res.end()
    })

    app.get('/user/:id', (req, res) => {
        let id = req.params.id
        res.status(200)
        res.json(users.getUser(id))
        res.end()
    })

    app.put('/user/:id', (req, res) => {
        let id = req.params.id
        res.status(204)
        res.end()
    })

    app.delete('/user/:id', (req, res) => {
        let id = req.params.id
        res.status(users.deleteUser(id) ? 202 : 204)
        res.end()
    })

    app.post('/user', (req, res) => {
        let username = req.body.username
        if (users.userExists(username)) {
            // res.status(204)
            res.setHeader('Set-Cookie', `error=${encodeURI('Username <b>')}${username}${encodeURI('</b> already existed')}`)
        } else {
            users.addUser({ username })
            res.status(201)
        }
        res.setHeader('refresh', '0;url=/')
        res.end()
    })

}