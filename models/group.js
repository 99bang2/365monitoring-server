'use strict'

const { Op } = require('sequelize')
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
    const group = sequelize.define('group', {
        uid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    }, {
        comment: "노티 수신자 그룹 정보",
        timestamps: true,
        paranoid:true,
        underscored: true
    })
    group.associate = (models) => {
        group.belongsToMany(models.recipient, {
            through: models.recipientGroup,
            foreignKey: "groupUid",
            otherKey: "recipientUid",
        });
        group.hasMany(models.device)
    }
    return group
}