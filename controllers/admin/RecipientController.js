'use strict'
const models = require('../../models')
const {Op, where, UniqueConstraintError} = require('sequelize')
const req = require('../../middle/requestHandler')
const moment = require("moment");
const request = require("../../configs/response-code.json");
const code = require("../../configs/response-code.json");

module.exports = {
    list: async (ctx) => {
        const recipients  = await models.recipient.findAll({
            include: [
                {
                    model: models.group,
                    attributes: ["uid", "name"], // groupUid만 가져오도록 설정
                    through: { attributes: [] }, // 중간 테이블의 데이터를 제외
                },
            ],
        });
        const result = recipients.map((recipient) => ({
            ...recipient.toJSON(),
            groups: recipient.groups.map((group) => group.uid), // groupUid 배열로 변환
        }));
        req.success(ctx, result);
    },

    create: async (ctx) => {
        const {groups, ..._} = ctx.request.body;

        try {
            let recipient = await models.recipient.create(_);
            for(let i = 0 ; i < groups.length; i++) {
                await models.recipientGroup.create({
                    groupUid: parseInt(groups[i]),
                    recipientUid: recipient.uid
                })
            }
            req.success(ctx, recipient);
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                //이미존재하는
                req.error(ctx, code.existRecipient);
            } else {
                req.error(ctx, code.customError);
            }
        }
    },
    update: async (ctx) => {
        const {uid} = ctx.params;
        const {groups, ..._} = ctx.request.body;
        try{
            //삭제,
            await models.recipientGroup.destroy({
                where: {
                    recipientUid: uid
                }
            })
            for(let i = 0 ; i < groups.length; i++) {
                await models.recipientGroup.create({
                    groupUid: parseInt(groups[i]),
                    recipientUid: uid
                })
            }
            let recipient = await models.recipient.findByPk(uid)
            if(!recipient) {
                req.error(ctx, code.wrongParameter)
            }
            Object.assign(recipient, {groups, ..._})
            await recipient.save()
            req.success(ctx, recipient)
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
            await models.recipientGroup.destory({
                where: {
                    recipientUid: uid
                }
            })

            const result = await models.recipient.destroy({
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