const mogoose = require('mongoose')
const Schema = mogoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const User = mogoose.model('User', userSchema)

module.exports = User;