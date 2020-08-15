const router = require('koa-router')()
// const {
//     getList,
//     getDetail,
//     newBlog,
//     updateBlog,
//     deleteBlog
// } = require('../controller/blog')

router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {
    // let author = req.query.author || ''
    // let keyword = req.query.keyword || ''
    // if (req.query.isadmin) {
    //     // 管理员界面
    //     if (req.session.username == null) {
    //         // 未登录
    //         res.json(new ErrorModel('未登录'))
    //         return
    //     }
    //     // 强制查询自己的博客
    //     author = req.session.username
    // }
    // let result = getList(author, keyword)
    // return result.then(list => {
    //     res.json(new SuccessModel(list))
    // })
    const query = ctx.query
    ctx.body = {
        query,
        ERR_NO: 0,
        data: '获取博客列表'
    }
})

router.get('/detail', function (ctx, next) {
    ctx.body = {
        ERR_NO: 0,
        data: '获取博客详情'
    }
})

module.exports = router
