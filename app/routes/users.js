const jwt = require('koa-jwt')
const Router = require('koa-router');
const router = new Router({ prefix: '/users' })
const { find, create, update, delete: del, findOne, login, checkOwner } = require('../controllers/users')
// const authToken = require('../middleware/authToken')
const { secret } = require('../config')

//引用koa-jwt来进行验证处理
const authToken = jwt({ secret })

router.get('/', find)

router.get('/:id', findOne)

router.post('/', create)

router.patch('/:id', authToken, checkOwner, update)

router.delete('/:id', authToken, checkOwner, del)

router.post('/login', login)

module.exports = router