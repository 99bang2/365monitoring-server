'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const KoaBody = require('koa-body')
const CORS = require('koa2-cors')
const { koaSwagger } 	= require('koa2-swagger-ui')
const yamljs 			= require('yamljs')
const consola = require('consola')

const routes = require('./router')
const models = require('./models')
const spec 		 = yamljs.load('./openApi.yaml')

const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/configs/config.json')[env]
const response = require('./middle/responseHandler')
//swagger

const app = new Koa()
const router = new Router()

router.use('/api/v1', response.res, routes.routes())
router.get('/docs', koaSwagger({routePrefix: false , swaggerOptions: {spec}}))

app.use(CORS())
app.use(KoaBody({
    multipart: true,
    formidable: {
        keepExtensions:true
    }
}))
app.use(router.routes()).use(router.allowedMethods())

models.sequelize.sync().then(async () => {
    app.listen(config.listenPort, async () => {
        let superAdmin = await models.user.findOne({
            where: {
                email: 'admin@daoldata.co.kr'
            }
        })
        if (!superAdmin) {
            let User = await models.user.create({
                uid: 1,
                name: '슈퍼관리자',
                email: 'admin@daoldata.co.kr',
                phone: "01033333333",
                password: 'admin',
                memo: '최고 관리자'
            })
        }



        consola.ready({
            message: `Server listening on ${config.listenPort}`,
            badge: true
        })
    })
})
