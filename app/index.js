const koa = require('koa')
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const routing = require('./routes')

const app = new koa()

app.use(error({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV == 'production' ? rest : { stack, ...rest }
}));
app.use(bodyparser());
app.use(parameter(app));
routing(app);

app.listen('3000', () => console.log('startting'))