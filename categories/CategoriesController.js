const express = require('express')
const Category = require('./Category')
const Article = require('../articles/Article')
const router = express.Router()
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')


// free routes
router.get('/categories', (req, res) => {
    Category.findAll().then(categories => {
        res.render('categories/index', { categories})
    })
})

router.get('/categories/:slug', (req, res) => {
    let slug = req.params.slug

    Category.findOne({where: {
        slug
    }, 
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Article.findAll().then(() => {
                res.render('categories/articles', {articles: category.articles, category})
            })
        }else{
            res.redirect('/categories')
        }
    }).catch(error => {
        res.send('erro ao encontrar categoria')
    })
})

// admin routes
router.get('/admin/categories', adminAuth, (req, res) => {

    Category.findAll({
        order: [
            ['id', 'asc']
        ]
    }).then(categories => {
        res.render('admin/categories/index', {categories})
    })
})

router.get('/admin/categories/new', adminAuth, (req, res) => {
    res.render('admin/categories/new')
})

router.post('/admin/categories/create', adminAuth, (req, res) => {
    let title = req.body.title

    if(title != undefined && title.length > 1){
        Category.create({
            title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories')
        }).catch(error => {
            res.send('erro' + error)
        })
    }else{
        res.redirect('/admin/categories')
    }
})

router.post('/admin/categories/delete', adminAuth, (req, res) => {
    let id = req.body.id
    
    if(id != undefined){
        if(!isNaN(id)){

            Category.destroy({where: {
                id: id
            }}).then(() => {
                res.redirect('/admin/categories')
            }).catch(error => {
                res.redirect('/admin/categories')
                console.log(error)
            })
        }else{
            res.redirect('/admin/categories')
            console.log('Esta categoria não contém um id numérico')
        }
    }
})

router.get('/admin/categories/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id

    Category.findByPk(id).then(categories => {
        res.render('admin/categories/edit', {categories})
    })
})

router.post('/admin/categories/update', adminAuth, (req, res) => {
    let id = req.body.id
    let title = req.body.title
    let slug = slugify(title)

    Category.update({title, slug}, {
        where: {
            id
        }
    }).then(() => {
        res.redirect('/admin/categories')
    }).catch(error => {
        res.redirect('/admin/categories')
        console.log(error)
    }) 
})

module.exports = router