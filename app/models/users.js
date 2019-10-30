const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')
const moment = require('moment')
const { Schema, model } = mongoose

moment.locale('zh-cn');

//构造用户数据库schema结构
const userSchema = new Schema({
    //用户名
    userName: { type: String, require: true },
    //密码
    password: { type: String, require: true, select: false },
    //邮箱
    email: { type: String, default: '' },
    //admin 0  其他 1
    type: { type: Number, default: 1 },
    //创建日期
    create_Time: { type: String, default: moment().format('MMMM Do YYYY, h:mm:ss a') },    //更加清晰的时间,
    //更新时间
    update_Time: { type: String, default: moment().format('MMMM Do YYYY, h:mm:ss a') },    //更加清晰的时间,
    //手机号码
    phone: { type: Number, default: 1 },
    __v: { type: Number, select: false },
})

userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
})

//导出model后的schema
module.exports = model('User', userSchema)

