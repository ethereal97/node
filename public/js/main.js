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
    listUser({ id, username }) {
        let users = this.section.users.querySelector('ul')
        let li = document.createElement('li')
        let user = document.createElement('span')
        let del = document.createElement('button')
        let toast = this.toast
        user.id = `user-${id}`
        user.textContent = username
        del.className = 'button button-outline'
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
    }
}

document.cookie.split(';').map(c => c.trim()).filter(c => c !== '').forEach(c => {
    let [name, value] = c.split('=')
    cookies[name] = value
})

fetch('/users').then(res => res.json()).then(users => users.forEach(user => app.listUser(user)))

if (cookies.error) {
    app.showError(decodeURIComponent(cookies.error))
    cookies.remove('error')
}