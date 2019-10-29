const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config')
const User = require('../models/users')


//users的控制器，主要是处理调用接口后的逻辑
class UsersCtx {
    async find(ctx) {
        ctx.body = await User.find()
    }

    async create(ctx) {
        //用verifyParams验证数据的类型
        ctx.verifyParams({
            name: { type: 'string', require: true },
            password: { type: 'string', require: true },
        });
        const { name } = ctx.request.body
        const repeatedUpdate = await User.findOne({ name });    //findOne查看是否有重复数据
        if (repeatedUpdate) { ctx.throw(409, '该用户已存在') }
        const user = await new User(ctx.request.body).save()    //new model save()来保存数据
        //RESUful规则，将新增的用户返回
        ctx.body = user
    }

    async findOne(ctx) {
        //通过id findById来查找指定用户
        const user = await User.findById(ctx.params.id)
        if (!user) {
            ctx.throw(404, '未找到用户')
        }
        ctx.body = user
    }

    async update(ctx) {
        //更新用户
        ctx.verifyParams({
            name: { type: 'string', require: false },
            password: { type: 'string', require: false },
        })

        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!user) { ctx.throw(404) }
        ctx.body = user
    }

    async delete(ctx) {
        //删除指定用户
        const user = await User.findByIdAndRemove(ctx.params.id)
        if (!user) { ctx.throw(404) }
        ctx.status = 204
    }

    async login(ctx) {
        ctx.verifyParams({
            name: { type: 'string', require: true },
            password: { type: 'string', require: true },
        });
        //如果数据库没有该用户名或者密码 抛出错误
        const user = await User.findOne(ctx.request.body);
        if (!user) { ctx.throw(401, '用户名或者密码不正确') }
        const { _id, name } = user
        //如果有，则用jsonwebtoken进行签名生成token返回给客户端
        const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })
        ctx.body = { token }
    }
}


//直接返回构造函数 便于routes调用的时候直接可以调用class的方法
module.exports = new UsersCtx()