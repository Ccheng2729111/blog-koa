const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
    name: { type: String, require: true },
    password: { type: String, require: true, select: false },
    __v: { type: Number, select: false }
})

module.exports = model('User', userSchema)

