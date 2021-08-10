const express = require('express')
const router = express.Router()
const Article = require('./Article')
const slugify = require('slugify')
const Category = require('../categories/Category')
const adminAuth = require('../middlewares/adminAuth')


// free routes
router.get('/articles', (req, res) => {
    
    Article.findAll({
        include: [
            {model: Category}
        ],
        order: [
            ['id', 'desc']
        ]
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('articles/index', {articles, categories})
        })
    })
})

router.get('/articles/:slug', (req, res) => {
    slug = req.params.slug

    Article.findOne({where: {
        slug
    }}).then(article => {
        res.render('articles/post', {article})
    })
})

// admin routes
router.get('/admin/articles', adminAuth, (req, res) => {
    
    Article.findAll({
        include: [
            {model: Category}
        ],
        order: [
            ['id', 'asc']
        ]
    }).then(articles => {
        res.render('admin/articles/index', {articles})
    })
})

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Article.findAll().then(articles => {
        Category.findAll().then(categories => {
            res.render('admin/articles/new', {articles, categories})    
        })
    })
})

router.post('/admin/articles/create', adminAuth, (req, res) => {
    let title = req.body.title
    let slug = slugify(title)
    let body = req.body.body
    let categoryId = req.body.category
    
    if(title != undefined && body != undefined && categoryId != 0 && title.length >= 1 && body != null){
        Article.create({
            title,
            body,
            slug,
            categoryId
        }).then(() => {
            res.redirect('/admin/articles')
        }).catch(error => {
            res.send(error)
        })
    }else{
        res.redirect('/admin/articles')
    }
})

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id

    Category.findAll().then(categories => {
        Article.findByPk(id).then(articles => {
            res.render('admin/articles/edit', {articles, categories})
        })
    })
})

router.post('/admin/articles/update', adminAuth, (req, res) => {
    let id = req.body.id
    let title = req.body.title
    let slug = slugify(title)
    let body = req.body.body
    let categoryId = req.body.categoryId

    Article.update({id, title, slug, body, categoryId}, {
        where: {
            id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    }).catch(error => {
        res.send('[ERRO]: ' + error)
    })
})

router.post('/admin/articles/delete', adminAuth, (req, res) => {
    let id = req.body.id

    if(id != undefined){
        if(!isNaN(id)){

            Article.destroy({where:{
                id
            }}).then(() => {
                res.redirect('/admin/articles')
            }).catch(error => {
                res.send('[ERRO]: ' + error)
            })
        }
    }else{
        res.send('ERRO, esta categoria não contém um id válido')
    }

})

module.exports = router