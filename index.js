const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')

const app = express()
// 设置模板目录
app.set('views',path.join(__dirname,'views'))
// 设置模板引擎为 ejs
app.set('view engine','ejs')

// 设置静态文件目录
app.use(express.static(path.join(__dirname,'public')))

// session 中间件

app.use(session({
    name:config.session.key, // 设置 cookie 中保存 session id 的字段名称
    secret:config.session.secret, // 通过设置secret 来计算 hash 值并放在cookie中，使产生的 signedCookie防篡改
    resve:true,//强制刷新 session
    saveUninitialized:false,//设置为false，强制创建一个session，即使用户未登陆
    cooke:{
        maxAge:config.session.maxAge // 过期时间
    },
    store:new MongoStore({ // 将session 存储到mongodb
        url:config.mongodb // mongodb 地址
    })
}))
// flash 中间件，用来显示通知
app.use(flash())
// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir:path.join(__dirname,'public/img'), // 上传目录
    keepExtensions:true
}))
// 设置模板全局常量
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
  }
  
  // 添加模板必需的三个变量
  app.use(function (req, res, next) {
    res.locals.user = req.session.user
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
  })

// 路由
routes(app)

// 监听端口，启动程序 
app.listen(config.port,function(){
    console.log(`${pkg.name} listen on port ${config.port}`)
})


/**
 * 注意：中间件的加载顺序很重要。如上面设置静态文件目录的中间件应该放到 routes(app) 之间加载，这样静态文件的请求就不回落到业务逻辑的路由里；
 * flash中间件应该放到session中间件之后加载，因为flash 是基于session 实现的
*/

