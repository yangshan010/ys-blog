const express = require('express')
const sha1 = require('sha1')
const router = express.Router()
const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

/**
 *  GET /signin 登录页
*/
router.get('/',checkNotLogin,function(req,res,next){
    // res.send('登陆页')
    res.render('signin')
})
/**
 *  POST /signin 用户登录
*/
router.post('/',checkNotLogin,function(req,res,next) {
    // res.send('登陆')
    const name = req.fields.name
    const password = req.fields.password
    // 校验参数
    try {
        if (!name.length) {
            throw new Error('请填写用户名')
        }
        if (!password.length) {
            throw new Error('请填写密码')
        }
    } catch(e) {
        req.flash('error',e.message)
        return res.redirect('back')
    }
    debugger;
    // 检查数据库
    UserModel.getUserByName(name)
    .then(function(user){
        if(!user) {
            req.flash('error','用户不存在')
            return res.redirect('back')
        }
        // 检查密码是否匹配
        if(sha1(password) !== user.password) {
            req.flash('error','用户名或者密码错误')
            return res.redirect('back')
        }
        req.flash('success','登陆成功')
        delete user.password
        req.session.user = user
        res.redirect('/posts')
    })
    .catch(next)
})
module.exports = router