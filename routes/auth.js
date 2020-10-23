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
        res.setHeader('Set-Cookie', `SESSID=${session_id};path=/;`)
    }

    return {
        session_id,
        user: sessions.find(session_id)
    }
}

router.route('/logout').get((req, res) => {
    let { SESSID } = cookie(req.headers.cookie)
    sessions.destroy(SESSID)
    res.setHeader('Set-Cookie', 'SESSID=;path=/');
    res.status(301);
    res.setHeader('refresh', '0;url=/');
    res.end();
})

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
            res.setHeader('Set-Cookie', 'error=' + encodeURI('Credential does not match') + ';path=/;');
            res.setHeader('refresh', '0;url=/auth');
            return res.end();
        }
        if (sessions.use(session_id, user)) {
            res.setHeader('Set-Cookie', `SESSID=${session_id}` + ';path=/;')
            res.setHeader('refresh', '0;url=/')
        }
        res.end()
    }).catch(err => {
        res.setHeader('Set-Cookie', 'error=' + encodeURI(err.message) + ';path=/;');
        res.setHeader('refresh', '0;url=/auth');
        res.end()
    })
})

router.route('/register').post((req, res) => {
    session_start(req, res);

    let { username, password, password_confirm, email } = req.body;

    if (password !== password_confirm) {
        res.setHeader('Set-Cookie', 'error=' + encodeURI('Password does not match') + ';path=/;');
        res.setHeader('refresh', '0;url=/register.html')
        return res.end()
    }

    let user = new User({ username, password, email })

    user.save().then(() => {
        res.setHeader('refresh', '0;url=/');
        res.end()
    }).catch(err => {
        res.setHeader('Set-Cookie', 'error=' + encodeURI(err.message) + ';path=/;');
        res.setHeader('refresh', '0;url=/register.html');
        res.end()
    })
})

module.exports = router
