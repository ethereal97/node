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
    let { SESSID } = cookie(req.headers.cookie);

    if (!SESSID) {
        SESSID = sessions.start();
        res.setHeader('Set-Cookie', `SESSID=${SESSID};path=/;`);
    }

    return {
        SESSID,
        user: sessions.find(SESSID)
    }
}

router.route('/logout').get((req, res) => {
    let { SESSID } = session_start(req, res);
    sessions.destroy(SESSID, res);
    res.send('<script>document.cookie="SESSID=;path=/;"</script>');
    res.setHeader('refresh', '1;url=/?logout=1');
    res.end();
})

router.route('/').get((req, res) => {
    let { user } = session_start(req, res)

    if (user) {
        return res.status(301).setHeader('refresh', '0;url=/').end()
    }

    readFile(join(publicPath, 'login.html'), 'utf-8', (err, result) => {
        if (err) return res.status(500).end();
        res.send(result);
        res.end();
    })
})

router.route('/').post((req, res) => {
    let { username, password } = req.body;
    let { SESSID } = session_start(req, res);

    User.findOne({ username }).then(user => {
        if (!verify(password, user.password)) {
            res.setHeader('Set-Cookie', 'error=' + encodeURI('Credential does not match') + ';path=/;');
            res.setHeader('refresh', '0;url=/auth');
            return res.end();
        }
        if (sessions.use(SESSID, user)) {
            res.setHeader('Set-Cookie', `SESSID=${SESSID}` + ';path=/;')
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

    password = generate(password);

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

module.exports = router;
