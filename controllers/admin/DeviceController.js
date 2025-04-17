'use strict'
const models = require('../../models')
const {Op, where, UniqueConstraintError} = require('sequelize')
const req = require('../../middle/requestHandler')
const moment = require("moment");
const axios = require("axios");
const request = require("../../configs/response-code.json");
const code = require("../../configs/response-code.json");
const utils = require("../../libs/utils");
const env = process.env.NODE_ENV || 'development'
const config = require('../../configs/config.json')[env]
const msgApiKey = config.MSG_API_KEY
const apiUrl = config.API_URL
const apiEndPoint = config.API_ENDPOINT
module.exports = {
    measure: async (ctx) => {
        const {modulers} = ctx.request.body;
        let result =[];
        let errCnt = 0;
        for (let md of modulers) {
            let moduler = await models.moduler.findOne({
                where: {
                    mac: md.mac
                }
            })
            if (!moduler) {
                console.log(`[moduler-mac] : ${md.mac} => not exist`)
                errCnt++;
                result.push({
                    id: md.mac,
                    ...code.notExistModulerMac
                })
            }else {
                if (!moduler.isNotify) {
                    console.log(`[moduler-mac] : ${md.mac} => not allow notify`)
                    errCnt++;
                    result.push({
                        id: md.mac,
                        ...code.notAllowNotify
                    })
                }
                else {
                    //진짜 실행로직
                    const lockDuration = moduler.lockDuration * 60 * 1000; // 5분 동안 락 걸기
                    const currentTime = Date.now();
                    const lastReceivedAt = new Date(moduler.lastReceivedAt).getTime();
                    const isSendable = currentTime - lastReceivedAt >= lockDuration
                    const isNotMute = currentTime - moduler.msgMuteTime > 5* 60 *1000;
                    console.log(`========[체크 기기: ${moduler.name}]========`)
                    console.log(`========[모듈러 맥: ${md.mac}]========`)
                    if (md.type === 'temp') {
                        console.log(`========[온도: ${md.temp}]========`)
                        moduler.temp = md.temp;
                    } else {
                        console.log(`========[닫힘센서: ${md.isClose}]========`)
                        moduler.isClose = md.isClose;
                    }

                    moduler.status = "ONLINE";


                    const modulerUid = moduler.uid;
                    let data = {modulerUid}
                    data.type = md.type
                    if(md.type === 'temp') {
                        data.temp = md.temp
                    }else {
                        data.isClose = md.isClose
                    }
                    let measureHistory = await models.measureHistory.create(data);
                    if (isSendable && isNotMute) {
                        // 그룹 및 수신자 가져오기
                        moduler.lastReceivedAt = new moment().format('YYYY-MM-DD HH:mm:ss');
                        let device = await models.device.findByPk(moduler.deviceUid);
                        let group = await models.group.findByPk(device.groupUid, {
                            include: [{model: models.recipient, attributes: ["uid", "name", "phone"], through: {attributes: []}}],
                        });
                        const recipients = group.recipients.map((recipient) => recipient.phone);
                        const macPrefix = md.mac.slice(0, 2);
                        const paddedUid = String(measureHistory.uid).padStart(3, '0');
                        let sendData = {
                            messageType: 'LMS',
                            templateCategory: 'info',
                            senderNumber: '0316049907',
                            title: md.type === 'temp' ? '[온도 경고] 비정상 범위 감지' : '[도어 경고] 닫힘 센서 오작동 감지',
                            isResend: false,
                            dataArray: recipients.map(v => {
                                const randomString = Array.from({length: 6}, () =>
                                    Math.random().toString(36).charAt(Math.random() < 0.5 ? 2 : 4)
                                ).join('');
                                const cliKey = `${macPrefix}${paddedUid}${randomString}`
                                return {
                                    phone: v,
                                    cliKey: cliKey,
                                }
                            })
                        }
                        const offUrl = `${apiEndPoint}/${moduler.uid}/off`
                        if(md.type === 'temp') {
                            if (md.temp < moduler.normalMin) {
                                sendData.content = `[${moduler.name}]에서 설정된 온도 범위를 미달했습니다.\n\n감지된 온도: ${md.temp}℃\n정상 범위: ${moduler.normalMin}℃ ~ ${moduler.normalMax}℃\n즉시 확인이 필요합니다.\n\n[잠시 알림끄기(5분)]\n${offUrl}`

                                console.log("========[적정온도미달]========")
                                await axios.post(apiUrl + '/msg/send', sendData, {
                                    headers: {ak: msgApiKey}
                                })
                                result.push({
                                    id: md.mac,
                                    code: 200,
                                    message: "온도센서가 [적정온도미달]메세지를 전송하였습니다."
                                })
                            } else if (md.temp > moduler.normalMax) {
                                sendData.content = `[${moduler.name}]에서 설정된 온도 범위를 초과했습니다.\n\n감지된 온도: ${md.temp}℃\n정상 범위: ${moduler.normalMin}℃ ~ ${moduler.normalMax}℃\n즉시 확인이 필요합니다.\n\n[잠시 알림끄기(5분)]\n${offUrl}`
                                console.log("========[적정온도초과]========")
                                await axios.post(apiUrl + '/msg/send', sendData, {
                                    headers: {ak: msgApiKey}
                                })
                                result.push({
                                    id: md.mac,
                                    code: 200,
                                    message: "온도센서가 [적정온도초과]메세지를 전송하였습니다."
                                })
                            }else {
                                result.push({
                                    id: md.mac,
                                    code: 200,
                                    message: "온도센서가 정상 작동하고 있습니다."
                                })
                            }
                        }
                        else {
                            if(md.isClose) {
                                sendData.content = `[${moduler.name}]에서 닫힘센서 오작동이 감지 되었습니다.\n\n즉시 확인이 필요합니다.\n\n[잠시 알림끄기(5분)]\n${offUrl}`
                                console.log("========[닫힘센서 오작동]========")
                                await axios.post(apiUrl + '/msg/send', sendData, {
                                    headers: {ak: msgApiKey}
                                })
                                result.push({
                                    id: md.mac,
                                    code: 200,
                                    message: "닫힘센서 [오작동]메세지를 전송하였습니다."
                                })
                            }else {
                                result.push({
                                    id: md.mac,
                                    code: 200,
                                    message: "닫힘센서가 정상 작동하고 있습니다."
                                })
                            }
                        }
                    }
                    else {
                        errCnt++;
                        result.push({
                            id: md.mac,
                            ...code.lockDuration
                        })
                    }
                    await moduler.save();
                }
            }
        }
        let data = {
            message: 'All Success',
            result: result
        }
        if(errCnt > 0 && errCnt < modulers.length) {
            data.message = 'some items failed to process.'
        } else if(errCnt === modulers.length) {
            data.message = 'All Failed'
        }
        req.success(ctx, data)
    },

    list: async (ctx) => {
        let devices = await models.device.findAll();
        req.success(ctx, devices);
    },

    create: async (ctx) => {
        const {name, mac, groupUid} = ctx.request.body;
        const userUid = ctx.user.uid;
        console.log(`userUid: ${userUid}, groupUid: ${groupUid}`)
        try {
            let device = await models.device.create({
                name,
                mac,
                userUid,
                groupUid,
            });
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
        let device = await models.device.findByPk(uid)
        if (!device) {
            req.error(ctx, code.wrongParameter)
        }
        Object.assign(device, _)
        await device.save()
        req.success(ctx, device)
    },
    delete: async (ctx) => {
        const {uid} = ctx.params;

        try {
            const result = await models.device.destroy({
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
    }
}