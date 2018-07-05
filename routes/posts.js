const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin
const PostsModel = require('../models/posts')

/**
 * Get /posts 所有用户或者特定用户的文章页
 * eg： GET /posts?autore = xxx
 * */ 
router.get('/',function (req,res,next) {
    res.render('posts')
})

/**
 * GET /posts/create  发表文章页
*/
router.get('/create',checkLogin,function (req,res,next) {
    res.render('create')
})

/**
 * POST /posts/crete   发表一篇文章
*/
router.post('/create',checkLogin,function(req,res,next) {
    // res.send('发表文章')
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content
    
    try {
        if (!title.length) {
           throw new Error ('请填写标题')
        }
        if (!content.length) {
            throw new Error ('请填写内容')
        }
        let post = {
            author:author,
            title:title,
            content:content
        }
        PostsModel.create(post)
        .then(function(result){
            // 此post是插入mongodb后的值，包含_id
            post = result.ops[0]
            console.log(result)
            req.flash('success','发表成功')
            return res.redirect(`/posts/${post._id}`)
        })
        .catch(next) 
    } catch(e) {
        req.flash('error',e.message)
        return res.redirect('back')
    }
})

/**
 * GET /posts/:postId 单独一篇的文章页
*/
router.get('/:postsId',function (req,res,next) {
    res.send('文章详情页')
})

/**
 * GET /posts/:postId/edit 更新文章页
*/
router.get('/:postsId/edit',checkLogin,function (req,res,next) {
    res.send('更新文章页')
})

/** 
 * POST /posts/:postId/edit 更新一篇文章
*/
router.post('/:postId/edit',checkLogin,function(req,res,next) {
    res.send('更新文章')
})

/**
 * GET /posts/:postId/remove 删除一篇文章
*/
router.get('/:postId/remove',checkLogin,function(req,res,next) {
    res.send('删除文章')
})
module.exports = router