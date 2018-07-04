module.exports = {
    port:4000,
    session: {
        secret:'myblog',
        key:'myblog',
        maxAge:2592000000
    },
    mongodb:'mongodb://localhost:27017/myblog'
}

/**
 * 
 *port 程序启动监听的端口号
 *  session: express-session 的配置信息，后面介绍
 * mongodb :mongodb 的地址，以mongodb:// 协议开头，myblog是db名
 * 
 * **/
