const koa = require('koa')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment');
const path = require('path')
const { url } = require('./config')
const routing = require('./routes')

const app = new koa()

mongoose.connect(url, { useNewUrlParser: true }, () => console.log('连接成功DB'))
mongoose.connection.on('err', () => console.error)

//自增id初始化
autoIncrement.initialize(mongoose.connection)

//通过koa-static将指定目录下的文件转换成静态连接
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(error({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV == 'production' ? rest : { stack, ...rest }
}));
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'),
        keepExtensions: true
    }
}));
app.use(parameter(app));
routing(app);

app.listen('3000', () => console.log('startting'))