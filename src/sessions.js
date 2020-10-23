const uuid = require("uuid").v4;

const sessions = new Object;

function start(user) {
    let session_id = uuid();
    if (typeof user === 'object') {
        user['SESSID'] = session_id;
        sessions[session_id] = user;
    }
    return session_id;
}

function use(session_id, user) {
    user['SESSID'] = session_id;
    sessions[session_id] = user;
    return session_id;
}

function exists(session_id) {
    return Boolean(sessions[session_id]);
}

function find(session_id) {
    return sessions[session_id];
}

function destroy(session_id) {
    delete sessions[session_id];
    return uuid();
}

module.exports = {
    start,
    find,
    exists,
    use,
    destroy
}
