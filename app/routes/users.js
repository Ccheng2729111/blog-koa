const Router = require('koa-router');
const router = new Router({ prefix: '/users' })
const { find, create, update, delete: del, findOne, login } = require('../controllers/users')
const authToken = require('../middleware/authToken')

router.get('/', find)

router.get('/:id', findOne)

router.post('/', create)

router.patch('/:id', authToken, update)

router.delete('/:id', authToken, del)

router.post('/login', login)

module.exports = router