const hash = require('password-hash');
const User = require('./User.model')
const cookie = require('./cookie');
const sessions = require('./sessions');

module.exports = function router(app, db) {
    app.post('/login', (req, res) => {
        let username = req.body.username
        let password = req.body.password

        User.find().then(users => {
            let user = users.find(user => user.username === username)

            if (!user) {
                res.setHeader('refresh', '0;url=/login.html?error=Username%20does%20not%20exist')
                return res.end()
            }

            if (!hash.verify(password, user.password)) {
                res.setHeader('refresh', '0;url=/login.html?error=Password%20does%20not%20match')
                res.end()
                return
            }

            let session_id = sessions.start(user);
            res.status(202)
            res.setHeader('Set-Cookie', `SESSID=${session_id}`)
            res.setHeader('refresh', '0;url=/')
            res.end()
        })
    })

    app.get('/timestamp', (req, res) => {
        res.send((new Date).getTime().toString())
        res.end()
    })

    app.get('/users', (req, res) => {
        let session_id = cookie.parse(req.headers.cookie).SESSID;

        if (!session_id) {
            res.status(401)
            return res.end()
        }

        if (!sessions.exists(session_id)) {
            res.status(401)
            return res.end()
        }

        User.find().then(users => {
            res.status(200)
            res.json(users.map(user => {
                return {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }))
            res.end()
        }).catch(err => {
            res.status(501)
            res.json(err)
            res.end()
        })
    })

    app.delete('/user/:id', (req, res) => {
        let id = req.params.id
        User.findByIdAndDelete(id).then(() => {
            res.status(202)
            res.end()
        }).catch((err) => {
            res.status(204)
            res.end()
        })
    })

    app.post('/user', (req, res) => {
        let username = req.body.username
        let password = req.body.password
        let password_confirm = req.body.password_confirm
        let email = req.body.email

        if (password !== password_confirm) {
            res.setHeader('Set-Cookie', 'error=' + encodeURI('Password does not match'))
            res.setHeader('refresh', '0;url=/')
            res.end();
        }

        password = hash.generate(password)

        let user = new User({
            username,
            password,
            email
        })

        user.save().then(() => {
            res.status(201)
            res.setHeader('refresh', '0;url=/')
            res.end()
        }).catch((err) => {
            res.setHeader('Set-Cookie', 'error=' + encodeURI(err.message))
            res.setHeader('refresh', '0;url=/')
            res.end()
        })
    })

}