let db = [{ name: 'lilei' }]

class UsersCtx {
    find(ctx) {
        ctx.body = db
    }

    create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', require: true },
            age: { type: 'number', require: true },
        })
        db.push(ctx.request.body)
        ctx.body = ctx.request.body
    }

    findOne(ctx) {
        if (+ctx.params.id >= 1) {
            ctx.throw(412)
        }
        ctx.body = `this is param post ${ctx.params.id} get method`
    }

    update(ctx) {
        ctx.body = `this is param post ${ctx.params.id} put method`
    }

    delete(ctx) {
        ctx.status = 204
    }
}

module.exports = new UsersCtx()