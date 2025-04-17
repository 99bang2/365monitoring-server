'use strict'
const Router = require('koa-router')
const auth = require('../middle/authMiddleware')
const admin = require('./adminRouter')

const api = new Router()
const controller = require("../controllers/admin");

api.post('/admin/login', controller.user.login);
api.post('/admin/signup', controller.user.signup);

api.post('/measure', controller.device.measure);
api.get('/:uid/off', controller.moduler.off)

api.use('/admin', auth.checkAuth, admin.routes());

module.exports = api