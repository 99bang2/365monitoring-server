'use strict'

const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
    const device = sequelize.define('device', {
        uid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            comment: "장비 UID"
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "장비명"
        },
        mac: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment: "장비 고유번호"
        }
    }, {
        comment: "장비 정보",
        timestamps: true,
        paranoid:true,
        underscored: true,
    })
    device.associate = (models) => {
        device.belongsTo(models.user);
        device.belongsTo(models.group);
        device.hasMany(models.moduler)
    }

    return device;
}