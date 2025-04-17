'use strict'

const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
    const measureHistory = sequelize.define('measureHistory', {
        uid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            comment: "UID"
        },
        type: {
            type: DataTypes.ENUM('temp', 'isClose'),
            allowNull: false,
            comment: "센서타입"
        },
        temp: {
            type: DataTypes.FLOAT,
            comment: "온도값(섭씨)"
        },
        isClose: {
            type: DataTypes.BOOLEAN,
            comment: "닫힘센서"
        }
    }, {
        comment: "온도측정값 히스토리",
        timestamps: true,
        // paranoid:true,
        underscored: true,
    })
    measureHistory.associate = (models) => {
        measureHistory.belongsTo(models.moduler);
    }

    return measureHistory;
}