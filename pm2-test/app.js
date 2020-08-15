const http = require('http')

const server = http.createServer((req, res) => {
    // 模拟日志
    console.log('currentTime', Date.now())
    // 模拟错误
    console.error('假装出错', Date.now())

    // 模拟一个错误
    if (req.url === '/err') {
        throw new Error('/err 出错了')
    }

    res.setHeader('Content-type', 'application/json')
    res.end(
        JSON.stringify({
            errno: 0,
            msg: 'Content-typ'
        })
    )
})

server.listen(8001)
console.log('server is listening on port 8001 ...')