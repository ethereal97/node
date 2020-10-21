const uuid = require("uuid").v4;

const sessions = {};

function start(user) {
    let session_id = uuid()
    if (typeof user === 'object') {
        sessions[session_id] = user;
    }
    return session_id;
}

function use(session_id, user) {
    sessions[session_id] = user
    return session_id
}

function exists(session_id) {
    return Boolean(sessions[session_id])
}

function find(session_id) {
    return sessions[session_id]
}

module.exports = {
    start,
    find,
    exists,
    use
}