const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')
const adminAuth = require('../middlewares/adminAuth')


router.get('/admin/users', adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', {users})
    })
})

router.get('/login', (req, res) => {
    res.render('admin/users/login')
})

router.get('/logout', adminAuth, (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

router.post('/admin/users/authenticate', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({where: {
        email
    }}).then(user => {
        if(user != undefined){

            let validate = bcrypt.compareSync(password, user.password)

            if(validate){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/')
            }else{
                res.redirect('/login')
            }
        }else{
            res.redirect('/login')
        }
    })
})

router.get('/admin/users/new', adminAuth, (req, res) => {
    res.render('admin/users/new')
})

router.post('/admin/users/create', adminAuth, (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let password2 = req.body.password2

    if(email == undefined || password != password2){
        res.send('erro')
    }else{
        User.findOne({where: {
            email
        }
        }).then(user => {
            if(user == undefined){

                let salt = bcrypt.genSaltSync(10)
                let hash = bcrypt.hashSync(password, salt)

                User.create({
                    email,
                    password: hash
                }).then(() => {
                    res.redirect('/admin/users')
                }).catch(error => {
                    res.send(error)
                })
            }
        })
    }
})

router.get('/admin/users/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id

    User.findOne({where: {
        id
    }}).then(user => {
        res.render('admin/users/edit', {user})
    })
})

router.post('/admin/users/update', adminAuth, (req, res) => {
    let email = req.body.email
    let id = req.body.id

    User.update({email}, {
        where: {
            id
        }
    }).then(() => {
        res.redirect('/admin/users')
    }).catch(error => {
        res.redirect('/admin/users')
    })
})

router.post('/admin/users/delete', adminAuth, (req, res) => {
    let id = req.body.id

    User.destroy({where: {
        id
    }}).then(() => {
        res.redirect('/admin/users')
    }).catch(error => {
        res.redirect('/admin/users')
    })
})

module.exports = router