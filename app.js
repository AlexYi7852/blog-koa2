const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const fs = require('fs')
const path = require('path')
const koaMorgan = require('koa-morgan')

const blog = require('./routes/blog')
const user = require('./routes/user')

const { REDIS_CONFIG } = require('./config/db')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
const env = process.env.NODE_ENV
// 记录日志
if (env !== 'production') {
  // 开发 or 测试环境
  app.use(koaMorgan('dev', {
    stream: process.stdout
  }));
} else {
  // 线上环境
  const fileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(fileName, {
    flags: 'a' // a: 追加、w: 覆盖
  })
  app.use(koaMorgan('combined', {
    stream: writeStream
  }));
}

// session 密匙
app.keys = ['WJios___--7852#']
app.use(session({
  // 配置cookie
  cookie: {
    path: '/', // 默认配置
    httpOnly: true, // 默认配置、限制前端修改 cookie
    maxAge: 24 * 60 * 60 * 1000 // 过期时间
  },
  // 配置 redis
  store: redisStore({
    all: `${ REDIS_CONFIG.host }:${ REDIS_CONFIG.port }`
  })
}))

// routes
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
