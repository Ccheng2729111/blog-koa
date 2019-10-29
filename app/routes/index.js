const fs = require('fs');

module.exports = (app) => {
    //用node自带的fs来获取当前目录的所有文件进行遍历
    fs.readdirSync(__dirname).forEach(file => {
        if (file === 'index.js') { return; }    //如果是index.js文件直接返回不做操作
        const route = require(`./${file}`);
        app.use(route.routes()).use(route.allowedMethods());
    });
}