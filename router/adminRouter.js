const auth = require("../middle/authMiddleware");
const controller = require("../controllers/admin");
const Router = require('koa-router')
const api = new Router()

api.get('/info', controller.user.info)
api.get('/logout', controller.user.logout)

api.get('/devices', controller.device.list);
api.post('/devices', controller.device.create);
api.patch('/devices/:uid', controller.device.update);
api.delete('/devices/:uid', controller.device.delete);

api.get('/modulers', controller.moduler.list);
api.post('/modulers', controller.moduler.create);
api.patch('/modulers/:uid', controller.moduler.update);
api.delete('/modulers/:uid', controller.moduler.delete);

api.get('/groups', controller.group.list);
api.post('/groups', controller.group.create);
api.patch('/groups/:uid', controller.group.update);
api.delete('/groups/:uid', controller.group.delete);

api.get('/recipients', controller.recipient.list);
api.post('/recipients', controller.recipient.create);
api.patch('/recipients/:uid', controller.recipient.update);
api.delete('/recipients/:uid', controller.recipient.delete);

api.get('/measures', controller.measureHistory.list);
api.get('/measures/chart', controller.measureHistory.chart);

module.exports = api