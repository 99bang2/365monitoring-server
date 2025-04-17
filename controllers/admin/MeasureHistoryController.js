const models = require("../../models");
const req = require("../../middle/requestHandler");
const moment = require("moment");
const {Op} = require("sequelize");
module.exports = {
    list: async (ctx) => {
        let now = new Date();
        let oneHoursAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
        let measures = await models.measureHistory.findAll({
            where:{
                createdAt: {
                    [Op.gt]: oneHoursAgo,
                },
                type: 'temp'
            },
            include: {
                model: models.moduler
            },
            order:[['created_at', 'DESC']]
        });
        req.success(ctx, measures);
    },
    chart: async(ctx) => {
        let now = new Date();
        let oneHoursAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
        let measures = await models.measureHistory.findAll({
            where: {
                createdAt: {
                    [Op.gt]: oneHoursAgo,
                },
                type: 'temp'
            },
            include: {
                model: models.moduler
            },
            order:[['created_at', 'ASC']]
        })
        const timestamps = [...new Set(measures.map((d)=> moment(d.createdAt).format('YYYY-MM-DD HH:mm:ss')))];
        const uniqueModulerNames = [...new Set(measures.map(m => m.moduler.name))]
        let datas = {};
        uniqueModulerNames.forEach(name => {
            datas[name] = [];
        });

        timestamps.forEach(timestamp => {
            uniqueModulerNames.forEach(modName => {
                const measure = measures.find(m => moment(m.createdAt).format('YYYY-MM-DD HH:mm:ss') === moment(timestamp).format('YYYY-MM-DD HH:mm:ss') && m.moduler.name === modName);
                datas[modName].push(measure ? measure.temp : null);
            });
        });
        let result= {
            x: timestamps,
            data: Object.keys(datas).map((moduler) => ({
                modulerName: moduler,
                values: datas[moduler]
            }))
        }
        req.success(ctx, result)
    }
}