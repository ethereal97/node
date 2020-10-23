const uuid = require("uuid").v4;

if (!'_sessions' in process) {
    process._sessions = new Object;
}

const sessions = process._sessions;

function start(response) {
    let id = uuid();
    if (response) {
        response.setHeader('Set-Cookie', `SESSID=${id};path=/;`);
    }
    return id;
}

function use(id, user) {
    user['SESSID'] = id;
    sessions[id] = user;
    return user;
}

function exists(id) {
    return Boolean(sessions[id]);
}

function find(id) {
    return sessions[id];
}

function destroy(id, response) {
    delete sessions[id];
    id = uuid();
    if (response) {
        response.setHeader('Set-Cookie', `SESSID=${id};path=/;`);
    }
    return id;
}

module.exports = {
    start,
    find,
    exists,
    use,
    destroy
}
