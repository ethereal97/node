module.exports = {
    parse(cookie) {
        let cookies = {}
        if (!cookie) return cookies;
        cookie.split(';').map(c => c.trim()).filter(c => c !== '').forEach(c => {
            let [name, value] = c.split('=')
            cookies[name] = value
        })
        return cookies;
    }
}