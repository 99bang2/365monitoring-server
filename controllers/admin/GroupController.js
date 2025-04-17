'use strict'
const models = require('../../models')
const {Op, where, UniqueConstraintError} = require('sequelize')
const req = require('../../middle/requestHandler')
const moment = require("moment");
const request = require("../../configs/response-code.json");
const code = require("../../configs/response-code.json");

module.exports = {
    list: async (ctx) => {
        let groups = await models.group.findAll();
        req.success(ctx, groups);
    },
    update: async (ctx) => {
        const {uid} = ctx.params;
        const _ = ctx.request.body;
        let group = await models.group.findByPk(uid)
        if (!group) {
            req.error(ctx, code.wrongParameter)
        }
        Object.assign(group, _)
        await group.save()
        req.success(ctx, group)
    },
    create: async (ctx) => {
        const { name } = ctx.request.body;

        try {
            let group = await models.group.create({
                name
            });

            req.success(ctx, group);
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                //이미존재하는
                req.error(ctx, code.existRecipient);
            } else {
                req.error(ctx, code.customError);
            }
        }
    },

    delete: async (ctx) => {
        const { uid } = ctx.params;

        try {
            const result = await models.group.destroy({
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
}