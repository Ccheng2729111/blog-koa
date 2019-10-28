class HomeCtx {
    index(ctx) {
        ctx.body = 'this is home page'
    }
}

module.exports = new HomeCtx()