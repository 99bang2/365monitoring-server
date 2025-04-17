'use strict'

const log = require('consola')
const code = require('../configs/response-code.json')
const auth = require('./authMiddleware')

/**
 * 로그 및 에러 캐치
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
exports.res = async (ctx, next) => {
    try {
        let params = JSON.parse(JSON.stringify(ctx.request.body))
        log.info('REQUEST', {
            method: ctx.request.method,
            url: ctx.request.url,
            ip: ctx.request.ip,
            referer: ctx.request.header.referer,
            authorization: ctx.request.headers.authorization,
            params: params,
        })
        ctx.user =  await auth.getAuth(ctx)
        await next()
    } catch (err) {
        log.error(err)
        if (err.name === 'SequelizeValidationError') {
            ctx.status = code.validationError.code
            ctx.body = {
                result: {
                    code: code.validationError.code,
                    message: err.errors[0].message
                }
            }
        } else if (err.name === 'SequelizeUniqueConstraintError') {
            ctx.status = code.validationUniqueError.code
            ctx.body = {
                result: code.validationUniqueError
            }
        } else {
            if (err.code) {
                ctx.status = err.code
                ctx.body = {
                    success: false,
                    result: err
                }
            } else {
                ctx.status = code.serverError.code
                ctx.body = {
                    success: false,
                    result: code.serverError
                }
            }
        }

    } finally {
        let resLog = {
            method: ctx.request.method,
            url: ctx.request.url,
            ip: ctx.request.ip,
            referer: ctx.request.header.referer,
            status: ctx.status,
            result: ctx.body.result,
            message: ctx.message
        }

        if (ctx.status === 200) {
            log.success('RESPONSE', resLog)
        } else {
            log.error('RESPONSE', resLog)
        }
    }
}
