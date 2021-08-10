const Sequelize = require('sequelize')

const connection = new Sequelize('blogx', 'root', '#######',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection