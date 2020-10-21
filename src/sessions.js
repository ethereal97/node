const uuid = require("uuid").v4;

const sessions = {};

function start(user) {
    let session_id = uuid()
    sessions[session_id] = user;
    return session_id;
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
    exists
}