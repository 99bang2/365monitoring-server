'use strict'

const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
    //TODO INDEX 설정
    const moduler = sequelize.define('moduler', {
        uid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            comment: "모듈러 UID"
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "모듈러 명"
        },
        type: {
            type: DataTypes.ENUM('temp', 'isClose'),
            allowNull: false,
            defaultValue: 'temp'
        },
        mac: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment: "모듈 고유번호"
        },
        temp: {
            type: DataTypes.FLOAT,
            comment: "온도값(섭씨)"
        },
        isClose: {
            type: DataTypes.BOOLEAN,
            comment: "닫힘센서"
        },
        normalMin: {
            type: DataTypes.FLOAT,
            allowNull: true,
            comment: "정상 범위(최소값)"
        },
        normalMax: {
            type: DataTypes.FLOAT,
            allowNull: true,
            comment: "정상 범위(최대값)"
        },
        lockDuration: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "수신거부시간"
        },
        lastReceivedAt: {
            type: DataTypes.DATE,
            comment: "마지막 수신일시",
            get: function (name) {
                let data = this.getDataValue(name)
                return data ? moment(data).format('YYYY-MM-DD HH:mm:ss') : null
            }
        },
        msgMuteTime: {
            type: DataTypes.DATE,
            comment: "메세지 거부 시간",
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "OFFLINE",
            comment: "모듈러 상태 (OFFLINE, ONLINE)"
        },
        isNotify: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: "알림 설정"
        },
    }, {
        comment: "온도계 정보",
        timestamps: true,
        paranoid: true,
        underscored: true,
    })

    moduler.associate = (models) => {
        moduler.belongsTo(models.device, {foreignKey: 'deviceUid'})
    }

    return moduler;
}