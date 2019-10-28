const Router = require('koa-router');
const router = new Router({ prefix: '/users' })
const { find, create, update, delete: del, findOne } = require('../controllers/users')

router.get('/', find)

router.get('/:id', findOne)

router.post('/', create)

router.put('/:id', update)

router.delete('/:id', del)

module.exports = router