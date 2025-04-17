'use strict'

const { Op } = require('sequelize')
const bcrypt = require('../libs/bcrypt')
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
    //TODO INDEX 설정

    const user = sequelize.define('user', {
        uid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        createdAt: {
            type: DataTypes.DATE,
            get: function (name) {
                let data = this.getDataValue(name)
                return data ? moment(data).format('YYYY-MM-DD HH:mm:ss') : null
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            get: function (name) {
                let data = this.getDataValue(name)
                return data ? moment(data).format('YYYY-MM-DD HH:mm:ss') : null
            }
        },
        deletedAt: {
            type: DataTypes.DATE,
            get: function (name) {
                let data = this.getDataValue(name)
                return data ? moment(data).format('YYYY-MM-DD HH:mm:ss') : null
            }
        }
    }, {
        comment: "유저 계정 정보",
        timestamps: true,
        paranoid:true,
        underscored: true,
        hooks: {
            beforeCreate: (model, options) => {
                return bcrypt.passwordCrypt(model, sequelize)
            },
            beforeUpdate: (model, options) => {
                return bcrypt.passwordCrypt(model, sequelize)
            }
        }
    })
    user.associate = (models) => {
        // account.hasMany(models.post)
    }
    user.applyScope = () => {
        user.addScope('defaultScope', {
            attributes: {
                exclude: ['password']
            }
        })
        user.addScope('login', {
            attributes: ['uid', 'email', 'password', 'isActive']
        })
    }
    user.prototype.validPassword = async function (password) {
        return bcrypt.validPassword(password, this.password)
    }
    return user
}