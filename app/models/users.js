const mongoose = require('mongoose')

const { Schema, model } = mongoose

//构造用户数据库schema结构
const userSchema = new Schema({
    name: { type: String, require: true },
    password: { type: String, require: true, select: false },
    __v: { type: Number, select: false }
})

//导出model后的schema
module.exports = model('User', userSchema)

