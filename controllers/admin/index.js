'use strict'
const user = require('./UserController');
const device = require('./DeviceController');
const group = require('./GroupController');
const recipient = require('./RecipientController');
const measureHistory = require('./MeasureHistoryController')
const moduler = require('./ModulerController')
module.exports = {
    user,
    device,
    group,
    recipient,
    measureHistory,
    moduler
}