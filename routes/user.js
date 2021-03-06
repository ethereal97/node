const { Router } = require("express");
const { cookie } = require("../src/utils");
const sessions = require("../src/sessions");
const User = require("../src/User.model");

const router = Router()

router.route('/').get((req, res) => {
    let { SESSID } = cookie(req.headers.cookie)
    if (!SESSID) {
        return res.status(401).end()
    }

    if (!sessions.exists(SESSID)) {
        return res.status(401).end()
    }

    User.find((err, users) => {
        if (err) return res.status(500).json({ message: err.message }).end()
        res.json(users.map(user => {
            let { _id, username, email } = user
            return {
                id: _id,
                username,
                email,
                permission
            }
        }))
        res.end()
    })
})

router.route('/:_id').delete((req, res) => {
    let { _id } = req.params;
    let { SESSID } = cookie(req.headers.cookie);
    
    if (!SESSID || !sessions.exists(SESSID)) {
        return res.status(401).end();
    }

    User.findOneAndDelete({ _id }).then(() => {
        res.status(202);
        res.end();
    }).catch(err => {
        res.status(204);
        res.end();
    })
})

module.exports = router
