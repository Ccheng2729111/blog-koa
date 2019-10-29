const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config')
const User = require('../models/users')

class UsersCtx {
    async find(ctx) {
        ctx.body = await User.find()
    }

    async create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', require: true },
            password: { type: 'string', require: true },
        });
        const { name } = ctx.request.body
        const repeatedUpdate = await User.findOne({ name });
        if (repeatedUpdate) { ctx.throw(409, '该用户已存在') }
        const user = await new User(ctx.request.body).save()
        ctx.body = user
    }

    async findOne(ctx) {
        const user = await User.findById(ctx.params.id)
        if (!user) {
            ctx.throw(404, '未找到用户')
        }
        ctx.body = user
    }

    async update(ctx) {
        ctx.verifyParams({
            name: { type: 'string', require: false },
            password: { type: 'string', require: false },
        })

        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!user) { ctx.throw(404) }
        ctx.body = user
    }

    async delete(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id)
        if (!user) { ctx.throw(404) }
        ctx.status = 204
    }

    async login(ctx) {
        ctx.verifyParams({
            name: { type: 'string', require: true },
            password: { type: 'string', require: true },
        });

        const user = await User.findOne(ctx.request.body);
        if (!user) { ctx.throw(401, '用户名或者密码不正确') }
        const { _id, name } = user
        const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })
        ctx.body = { token }
    }
}

module.exports = new UsersCtx()