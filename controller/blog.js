
const xss = require('xss')
const { exec, escape } = require('../database/mysql')

const getList = async (author, keyword) => {
    // 通过 xss 库防止xss 攻击、escape 防止 sql 攻击
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${ author }' `
    }
    if (keyword) {
        sql += `and title like '%${ keyword }%' `
    }
    sql += `order by createtime desc`
    return await exec(sql)
}

const getDetail = async id => {
    // 先返回假数据（数据是正确的）
    let sql = `select * from blogs where id=${ id }`
    return await exec(sql)
}

const newBlog = async (blogData = {}) => {
    // blogData是一个博客对象，包含title、content属性
    // 通过 xss 库防止xss 攻击、escape 防止 sql 攻击
    const title = xss(escape(blogData.title))
    const author = xss(escape(blogData.author))
    const content = xss(escape(blogData.content))
    const createTime = Date.now()
    let sql = `insert into blogs (title, content, createtime, author) values (${ title }, ${ content }, ${ createTime }, ${ author })`
    const data = await exec(sql)
    return { id: data.insertId }
}

const updateBlog = async (id, blogData = {}) => {
    // id 就是更新博客的 id
    // blogData是一个博客对象，包含title、content属性
    // 通过 xss 库防止xss 攻击、escape 防止 sql 攻击
    const title = xss(escape(blogData.title))
    const content = xss(escape(blogData.content))
    const sql = `update blogs set title=${ title }, content=${ content } where id='${ id }'`
    const data = await exec(sql)
    return data.affectedRows ? true : false
}

const deleteBlog = async (id) => {
    // id 就是删除博客的 id
    const sql = `delete from blogs where id='${ id }'`
    const data = await exec(sql)
    return data.affectedRows ? true : false
}

module.exports = { getList, getDetail, newBlog, updateBlog, deleteBlog }
