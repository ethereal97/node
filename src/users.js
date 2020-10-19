const users = [];

function getAll() {
    return users.filter(user => user !== null);
}

function getUser(id) {
    return users[id - 1]
}

function deleteUser(id) {
    delete users[id - 1];
    return true;
}

function addUser(user) {
    user.id = users.length + 1;
    users.push(user);
}

module.exports = {
    deleteUser,
    addUser,
    getUser,
    getAll
}