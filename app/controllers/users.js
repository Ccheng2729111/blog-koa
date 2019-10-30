const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config')
const User = require('../models/users')
const moment = require('moment')

moment.locale('zh-cn');


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

    async checkOwner(ctx, next) {
        //验证当前操作的用户是否是本人
        const { id } = ctx.params

        const userRole = await User.findById(id)

        if (!userRole) { ctx.throw(401, '未找到该用户') }
        //判断是否是本人操作或者不是admin
        if (userRole.type !== 0 || (ctx.params.id !== ctx.state.user._id)) {
            ctx.throw(403, '没有权限进行操作')
        }
        await next()
    }

    async update(ctx) {
        //更新用户
        const { phone, email, password } = ctx.request.body

        const reg = new RegExp(
            '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$',
        ); //正则表达式
        if (email && !reg.test(email)) {
            ctx.throw(400, '请输入正确格式的邮箱')
        }

        const phoneReg = new RegExp(/^1[3456789]\d{9}$/)
        if (phone && !phoneReg.test(phone)) {
            ctx.throw(400, '请输入正确格式的手机号码')
        }

        const update_time = moment().format('MMMM Do YYYY, h:mm:ss a')  //加上更新时间
        const user = await User.findByIdAndUpdate(ctx.params.id, { ...ctx.request.body, update_time }, { new: true })   //update后返回最新数据
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
        // ctx.verifyParams({
        //     userName: { type: 'string', require: true },
        //     password: { type: 'string', require: true },
        // });
        const { password, userName } = ctx.request.body

        if (!password) { ctx.throw(400, '密码不能为空') }
        if (!userName) { ctx.throw(400, '用户名不能为空') }
        //如果数据库没有该用户名或者密码 抛出错误
        const user = await User.findOne(ctx.request.body);
        if (!user) { ctx.throw(401, '用户名或者密码不正确') }
        const { _id, name } = user
        //如果有，则用jsonwebtoken进行签名生成token返回给客户端
        const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })
        ctx.body = { token }
    }

    async register(ctx) {
        //用verifyParams验证数据的类型
        // ctx.verifyParams({
        //     userName: { type: 'string', require: true },
        //     password: { type: 'string', require: true },
        //     email: { type: 'string', require: true },
        // });
        // verifyParams验证出来报错信息不是很友好，暂时自己判断
        const { userName, email, password } = ctx.request.body

        if (!email) { ctx.throw(400, '用户邮箱不能为空') }
        if (!password) { ctx.throw(400, '密码不能为空') }
        if (!userName) { ctx.throw(400, '用户名不能为空') }
        const reg = new RegExp(
            '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$',
        ); //正则表达式
        if (!reg.test(email)) {
            { ctx.throw(400, '请输入正确格式的邮箱') }
        }

        const repeatedUpdate = await User.findOne({ userName });    //findOne查看是否有重复数据
        if (repeatedUpdate) { ctx.throw(409, '该用户已存在') }
        const user = await new User(ctx.request.body).save()    //new model save()来保存数据
        //RESUful规则，将新增的用户返回
        ctx.body = user
    }


}


//直接返回构造函数 便于routes调用的时候直接可以调用class的方法
module.exports = new UsersCtx()