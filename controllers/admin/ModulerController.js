'use strict'
const models = require('../../models')
const {Op, where, UniqueConstraintError} = require('sequelize')
const req = require('../../middle/requestHandler')
const moment = require("moment");
const code = require("../../configs/response-code.json");
module.exports = {
    list: async (ctx) => {
        const {deviceUid} = ctx.query
        console.log("deviceUid", deviceUid)
        let modulers = await models.moduler.findAll({
            where: {
                deviceUid
            }
        });
        console.log("moduler", modulers)
        req.success(ctx, modulers);
    },

    create: async (ctx) => {
        const _ = ctx.request.body;
        _.lastReceivedAt = new moment().format("YYYY-MM-DD HH:mm:ss");
        if(_.type=== 'temp') {
            _.temp = -100.0;
        }
        try {
            let device = await models.moduler.create(_);
            req.success(ctx, device);
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                //이미존재하는
                req.error(ctx, code.existDeviceMac);
            } else {
                //에러
                req.error(ctx, code.customError);
            }
        }
    },
    update: async (ctx) => {
        const {uid} = ctx.params;
        const _ = ctx.request.body;
        console.log(_)
        let moduler = await models.moduler.findByPk(uid)
        if (!moduler) {
            req.error(ctx, code.wrongParameter)
        }
        Object.assign(moduler, _)
        await moduler.save()
        req.success(ctx, moduler)
    },
    delete: async (ctx) => {
        const {uid} = ctx.params;

        try {
            const result = await models.moduler.destroy({
                where: {
                    uid: uid
                }
            })

            if (result === 1) {
                //정상 삭제
                let data = {};
                req.success(ctx, data);
            } else {
                //찾을 수 없음
                let data = {};
                req.success(ctx, data);
            }
        } catch (error) {
            console.error(error);
        }
    },
    off: async(ctx) => {
        const {uid} = ctx.params;
        let moduler = await models.moduler.findByPk(uid)
        if (!moduler) {
            req.error(ctx, code.wrongParameter)
        }
        Object.assign(moduler, {
            msgMuteTime: moment().format("YYYY-MM-DD HH:mm:ss")
        })
        await moduler.save()
        ctx.body = "5분간 알림이 꺼집니다."
    }
}