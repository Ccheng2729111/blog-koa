const path = require('path')
const Home = require('../models/home')
class HomeCtx {
    index(ctx) {
        ctx.body = 'this is home page'
    }
    async upload(ctx) {
        //从request中获取用户上传的文件对象
        const file = ctx.request.files.file;
        //通过path的basename获取文件的basename字符串
        const basename = path.basename(file.path)
        //ctx.origin获取当前本地域名拼接文件路径以及basename返回一个url连接
        const url = `${ctx.origin}/uploads/${basename}`
        const saveUrl = await new Home({ url }).save()
        ctx.body = saveUrl
    }
}

module.exports = new HomeCtx()