const cookie = require('./cookie');

module.exports = {
    cookie(c) {
        return cookie.parse(c || '')
    },
}