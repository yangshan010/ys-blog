const Posts = require('../lib/mongo').Post

module.exports = {
    create:function create(post) {
        return Posts.create(post).exec()
    }
}