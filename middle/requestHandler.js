'use strict'

const requestCode = require('../configs/response-code.json')

module.exports = {
    success: (ctx, data, message) => {
        // let result = requestCode.success

        let result = {
            success: true
        }

        if (message) {
            result.message = message
        } else {
            result.message = "성공"
        }

        // ctx.status = result.code
        ctx.body = {
            result: result,
            data: data
        }
    },
    error: (ctx, code) => {
        let response= code;

        // if (!response) {
        //     response = requestCode.customError
        // }
        //
        // if (message) {
        //     response.message = message
        // }

        ctx.throw(response)
    },
}
