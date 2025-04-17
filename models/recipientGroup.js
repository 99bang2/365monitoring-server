'use strict'

const { Op } = require('sequelize')
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
    const recipientGroup = sequelize.define('recipientGroup', {
        uid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        }
    }, {
        comment: "노티 수신자 그룹 정보",
        underscored: true,
    })
    recipientGroup.associate = (models) => {
        recipientGroup.belongsTo(models.group);
        recipientGroup.belongsTo(models.recipient);
    }

    return recipientGroup
}