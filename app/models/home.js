const mongoose = require('mongoose')

const { Schema, model } = mongoose

const homeSchema = new Schema({
    url: { type: String, require: true },
    __v: { type: Number, select: false }
})

//导出model后的schema
module.exports = model('Home', homeSchema)

