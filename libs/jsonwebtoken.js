'use strict'

const env = process.env.NODE_ENV || 'development'
const jwt = require('jsonwebtoken')
const config = require('../configs/config.json')
const key = config[env].jwt.secret;
const expiresIn = config[env].jwt.expiresIn;

const options = {
    expiresIn: expiresIn, // 만료시간 15분
}

module.exports = {
    generateToken: async function (model) {
        let tokenObject = {
            uid: model.uid,
            email: model.email,
        }

        return await jwt.sign(tokenObject, key, options)
    },
    verifyToken: async function (token, flag) {
        try {
            return await jwt.verify(token, key, {
                ignoreExpiration: flag
            })
        } catch (e) {
            return null
        }
    }
}
