
const xss = require('xss')
const { getPassword } = require('../utils/cryp')
const { exec, escape } = require('../database/mysql')
const login = async (username, password) => {
    // 通过 xss 库防止xss 攻击、escape 防止 sql 攻击
    username = xss(escape(username))
    // 生成加密密码
    password = xss(escape(getPassword(password)))
    const sql = `select username, realname from users where username=${ username } and password=${ password }`
    const data = await exec(sql)
    return data[0] || {}
}

module.exports = { login }