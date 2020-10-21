const { Router } = require("express");
const { cookie } = require("../src/utils");
const sessions = require("../src/sessions");
const User = require("../src/User.model");

const router = Router()

router.route('/').get((req, res) => {
    let cookies = cookie(req.headers.cookie)
    if (!cookies.SESSID) {
        return res.status(401).end()
    }

    if (!sessions.exists(cookies.SESSID)) {
        return res.status(401).end()
    }

    User.find((err, users) => {
        if (err) return res.status(500).json({ message: err.message }).end()
        res.json(users.map(user => {
            let { _id, username, email } = user

            return {
                _id,
                username,
                email
            }
        }))
        res.end()
    })
})

module.exports = router