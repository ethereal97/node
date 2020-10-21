let cookies = {
    remove(name) {
        delete this[name]
        document.cookie = `${name}=;expires=${(new Date(0)).toUTCString()}`
    }
};
let q = new URLSearchParams(location.search)
let app = {
    section: {
        users: document.querySelector('section#users'),
        addUser: document.querySelector('section#add-user'),
        error: document.querySelector('#error-message')
    },
    showError(error) {
        // let ul = this.section.error;
        // let li = document.createElement('li')
        // li.innerHTML = error
        // ul.appendChild(li)
        this.toast(error)
    },
    listUser({ id, username, email }) {
        let users = this.section.users.querySelector('ul')
        let li = document.createElement('li')
        let user = document.createElement('span')
        let del = document.createElement('button')
        let edit = document.createElement('button')
        let toast = this.toast
        user.id = `user-${id}`
        user.innerHTML = `<a href="mailto:${email}">${username}</a>`
        del.className = 'button button-outline delete'
        del.textContent = 'Delete'
        del.addEventListener('click', () => {
            fetch(`/user/${id}`, { method: "DELETE" }).then(res => res.status).then(status => {
                if (status !== 202) {
                    toast(`User#${id} was failed to delete`)
                    return
                }
                toast(`User#${id} was deleted`)
                li.remove();
            })
        })
        edit.className = 'button button-outline edit'
        edit.textContent = 'Edit'
        li.appendChild(user)
        li.appendChild(del)
        users.appendChild(li)
    },
    toast(message) {
        var el = document.createElement('div')
        el.className = 'toast show'
        el.innerHTML = message
        setTimeout(() => {
            el.remove()
        }, 2800)
        document.body.appendChild(el)
    },
    logout() {
        cookie.remove('SESSID')
        location.reload()
    }
}

document.cookie.split(';').map(c => c.trim()).filter(c => c !== '').forEach(c => {
    let [name, value] = c.split('=')
    cookies[name] = value
})

fetch('/user').then(res => {
    if (res.status === 401) {
        var ul = app.section.users.querySelector('ul');
        fetch('/auth').then(res => res.text()).then(res => {
            ul.classList.remove('placeholder');
            app.section.users.innerHTML = res;
        })
        return [];
    }
    return res.json();
}).then(users => {
    app.section.users.querySelector('ul').classList.remove('placeholder');
    console.log(users);
    users.forEach(user => app.listUser(user));
})

if (cookies.error) {
    app.showError(decodeURIComponent(cookies.error));
    cookies.remove('error');
}