
const http = require('http')

// 组合中间件
function compose (middleWareList) {
    return (ctx) => {
        function dispatch (i) {
            const fn = middleWareList[i]
            try {
                return Promise.resolve(
                    fn(ctx, dispatch.bind(null, i + 1)) // promise
                )
            } catch (err) {
                return Promise.reject(err)
            }
        }
        dispatch(0)
    }
}
class LikeKoa2 {
    constructor () {
        this.middleWareList = []
    }
    use (fn) {
        this.middleWareList.push(fn)
        return this
    }

    createContext (req, res) {
        const context = { req, res }
        context.query = req.query
        return context
    }

    callback () {
        const fn = compose(this.middleWareList)
        return (req, res) => {
            const context = this.createContext(req, res)
            return fn(context)
        }
    }

    listen (...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = LikeKoa2