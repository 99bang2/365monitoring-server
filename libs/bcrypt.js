'use strict'

// library
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

// module
module.exports = {
    passwordCrypt: (model, seq) => {
        if (model.password) {
            return bcrypt.genSaltAsync(5)
                .then(function (salt) {
                    return bcrypt.hashAsync(model.password, salt, null)
                })
                .then(function (hash) {
                    model.password = hash
                })
                .catch(function (err) {
                    return seq.Promise.reject(err)
                })
        } else {
            return true
        }
    },
    validPassword: async (input, compare) => {
        return await bcrypt.compareAsync(input, compare)
    },
}