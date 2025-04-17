'use strict'
const env = process.env.NODE_ENV || 'development'

module.exports = {
    isNullOrUndefined: async function (value) {
        let result = typeof value === 'undefined' || value === null;
        return result;
    },
}
