const express = require('express')
const app = express()
const connection = require('./database/database')
const session = require('express-session')
const adminAuth = require('./middlewares/adminAuth')

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const usersController = require('./user/UsersController')

// body-parser
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// sessions
app.use(session({
    secret: 'amdsosdaopdsa4682168sda6sda6ad3dsa42dsa3',
    cookie: {maxAge: 9000000}
}))

// middlewares
app.use((req, res, next) => {
    if(req.session.user == undefined){
        user = 0
        next()
    }else{
        user = 1
        next()
    }
})

// view engine
app.set('view engine', 'ejs')

// static
app.use(express.static('public'))

// connection
connection.authenticate().then(() => {
    console.log('Conectado ao banco de dados')
}).catch(error => {
    console.log('Erro ao se conectar ao banco de dados: ' + error)
})

// routes
app.get('/', (req, res) => {
    res.render('index')
})

app.use('/', usersController)

app.use('/', categoriesController)

app.use('/', articlesController)

const port = 8080
app.listen(port, () => {
    console.log('Servidor rodando')
}) 