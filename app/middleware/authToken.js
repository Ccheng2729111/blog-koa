const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config')

//认证中间件，主要是用来解码token并且将获取到的解码后的数据放在user中
module.exports = authToken = async (ctx, next) => {
    //从header中获取加密后的token
    const { authorization = '' } = ctx.request.header

    const token = authorization.replace('Bearer ', ''); //去除多余的字段

    //捕捉如果验证失败抛出异常
    try {
        //解码token
        const user = jsonwebtoken.verify(token, secret)
        ctx.state.user = user
    } catch (err) {
        ctx.throw(401)
    }
    await next()
}