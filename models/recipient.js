'use strict'

const {Op} = require('sequelize')
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
    const recipient = sequelize.define('recipient', {
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
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    }, {
        comment: "노티 수신자 정보",
        timestamps: true,
        paranoid: true,
        underscored: true,
    })
    recipient.associate = (models) => {
        recipient.belongsToMany(models.group, {
            through: models.recipientGroup,
            foreignKey: "recipientUid",
            otherKey: "groupUid"
        });
    }

    return recipient
}