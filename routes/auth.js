const { readFile, read } = require("fs");
const { join, dirname } = require("path");
const { Router } = require("express");
const { cookie } = require("../src/utils");
const { generate, verify } = require('password-hash');
const sessions = require("../src/sessions");
const User = require("../src/User.model");

const router = Router()
const publicPath = join(dirname(__dirname), 'public')

function session_start(req, res) {
    let cookies = cookie(req.headers.cookie)
    let session_id = cookies.SESSID

    if (!session_id) {
        session_id = sessions.start()
        res.setHeader('Set-Cookie', `SESSID=${session_id}`)
    }

    return {
        session_id,
        user: sessions.find(session_id)
    }
}

router.route('/').get((req, res) => {
    let { user } = session_start(req, res)

    if (user) {
        return res.status(301).setHeader('refresh', '0;url=/').end()
    }

    readFile(join(publicPath, 'login.html'), 'utf-8', (err, result) => {
        if (err) res.status(404).end()
        res.send(result)
        res.end()
    })
})

router.route('/').post((req, res) => {
    let { username, password } = req.body
    let { session_id } = session_start(req, res)

    User.findOne({ username }).then(user => {
        if (!verify(password, user.password)) {
            return res.status(401).json({
                message: 'Password does not match'
            }).end();
        }
        if (sessions.use(session_id, user)) {
            res.setHeader('Set-Cookie', `SESSID=${session_id}`)
            res.setHeader('refresh', '0;url=/')
        }
        res.end()
    }).catch(err => {
        res.status(500).json({
            message: err.message
        }).end()
    })
})

module.exports = router