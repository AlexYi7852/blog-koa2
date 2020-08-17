const router = require('koa-router')()
const loginCheck = require('../middleWare/loginCheck')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
} = require('../controller/blog')

router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {
    let author = ctx.query.author || ''
    let keyword = ctx.query.keyword || ''
    if (ctx.query.isadmin) {
        // 管理员界面
        if (ctx.session.username == null) {
            // 未登录
            ctx.body = new ErrorModel('未登录')
            return
        }
        // 强制查询自己的博客
        author = ctx.session.username
    }
    const list = await getList(author, keyword)
    ctx.body = new SuccessModel(list)
})

router.get('/detail', async (ctx, next) => {
    const data = await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(data)
}) 

router.post('/new', loginCheck, async (ctx, next) => {
    ctx.request.body.author = ctx.session.username
    const data = await newBlog(ctx.request.body)
    ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async (ctx, next) => {
    const val = await updateBlog(ctx.query.id, ctx.request.body)
    ctx.body = val ? new SuccessModel() : new ErrorModel('更新博客失败')
})

router.post('/del', loginCheck, async (ctx, next) => {
    const val = await deleteBlog(ctx.query.id)
    ctx.body = val ? new SuccessModel() : new ErrorModel('删除博客失败')
})

module.exports = router
