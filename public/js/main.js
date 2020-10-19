let el = {
    section: {
        users: document.querySelector('section#users'),
        addUser: document.querySelector('section#add-user')
    },
    listUser({ id, username }) {
        let users = this.section.users.querySelector('ul')
        let li = document.createElement('li')
        let user = document.createElement('span')
        let del = document.createElement('button')
        user.id = `user-${id}`
        user.textContent = username
        del.className = 'button button-outline'
        del.textContent = 'Delete'
        del.addEventListener('click', () => {
            fetch(`/user/${id}`, { method: "DELETE" }).then(res => res.status).then(status => {
                if (status === 202) li.remove();
            })
        })
        li.appendChild(user)
        li.appendChild(del)
        users.appendChild(li)
    }
}

fetch('/users').then(res => res.json()).then(users => users.forEach(user => el.listUser(user)))