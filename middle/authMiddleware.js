'use strict'

// reference
const code  = require('../configs/response-code.json')
const jwt   = require('../libs/jsonwebtoken')
const models = require('../models')
// function
const authorization = function (ctx) {
    return ctx.request.headers.authorization && ctx.request.headers.authorization.split(' ')[0] === 'Bearer'
}

const token = function (ctx) {
    return ctx.request.headers.token
}

// module
module.exports = {
    getAuth: async function (ctx) {
        let accessToken
        if (token(ctx)) {
            accessToken = ctx.request.headers.token
        }
        if (authorization(ctx)) {
            accessToken = ctx.request.headers.authorization.split(' ')[1]
        }
        if (accessToken) {
            let infinityFlag = false
            return await jwt.verifyToken(accessToken, infinityFlag)
        }

        return null
    },
    checkAuth: async function (ctx, next) {
        if (!ctx.user) {
            ctx.throw(code.unauthorized)
        }

        await next()
    },
}
