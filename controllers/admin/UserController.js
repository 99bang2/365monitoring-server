'use strict'
const models = require('../../models')
const {Op} = require('sequelize')
const req = require('../../middle/requestHandler')
const moment = require("moment");
const axios = require("axios");
// const request = require("../configs/response-code.json");
const errorCode = require("../../configs/errorCode.json");
const jwt = require("../../libs/jsonwebtoken");

module.exports = {
    signup: async (ctx) => {
        let body = ctx.request.body;

        let user = await models.user.create({
            email: body.email,
            name: body.name,
            password: body.password,
            phone: body.phone,
            isActive: true,
        });
        req.success(ctx, user, {
            code: "10000",
            message:"가입완료"
        })
    },
    login: async (ctx) => {
        let body = ctx.request.body;
        let user = await models.user.scope('login').findOne({
            where: {
                email: body.email,
            }
        });

        let valid = false;
        if (user) {
            valid = await user.validPassword(body.password)
            console.log(valid);
        } else {
            req.error(ctx, errorCode.loginFailedNotExistEmail);
        }

        if (valid) {
            const token = await jwt.generateToken(user);
            const data = {
                "accessToken": token
            }
            req.success(ctx, data, "로그인 성공");
        } else {
            req.error(ctx, errorCode.loginFailedWrongPassword);
        }
    },
    info: async (ctx) => {
        let uid = ctx.user.uid
        let user = await models.user.findByPk(uid)
        req.success(ctx, {
            user: user
        })
    },
    logout: async (ctx) => {
        req.success(ctx, {})
    }
}