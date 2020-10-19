const users = [];

module.exports = function router(app) {
    app.get('/api/time', (req, res) => {
        let date = new Date
        res.json({
            ts: Math.round(date.getTime() / 1000),
            utc: date.toUTCString(),
            lc: date.toString()
        })
        res.end()
    })

    app.get('/api/users', (req, res) => {
        res.json(users)
        res.end()
    })

    app.get('/api/user/add/:name', (req, res) => {
        let user = {
            id: users.length + 1,
            name: req.params.name,
            created: Math.round((new Date).getTime() / 1000)
        }

        users.push(user)
        res.status(201)
        res.json(user)
        res.end()
    })
}
