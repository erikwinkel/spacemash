// requirements
require('dotenv').config()
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const { Sequelize } = require('sequelize')
const db = require('./models')
const methodOverride = require('method-override')

// config
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')

// middlewares
app.use(ejsLayouts)
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: false}))
app.use(express.static(__dirname + '/public/'))

app.use('/details', require('./controllers/details'))

// routes

app.get('/', (req,res) => {
    db.character.findAll({ order: Sequelize.literal('random()'), limit: 2 })
    .then(characters => {
        res.render('index', { characters })
    })
    .catch(error => {
        console.log(error)
    })

})

app.put('/', async (req,res) => {
    db.character.findOne({
        where: { name: req.body.vote}
    }).then( foundCharacter => {
        foundCharacter.rank++
        foundCharacter.save()
    })
    res.redirect('/')
})

app.get('/rankings', (req,res) => {
    db.character.findAll({ order: [['rank', 'DESC']]})
    .then(characters => {
        res.render('rankings', { characters })
    })
})

app.get('/login', (req,res) => {
    res.render('login')
})

app.post('/login', (req,res) => {
    db.user.findOne({ where: { username: req.body.username }})
    .then(foundUser => {
        if(foundUser && req.body.password === foundUser.pw){
            db.character.findAll({ order: Sequelize.literal('random()'), limit: 2 })
            .then(characters => {
                res.render('index', { username: foundUser.username, characters })
            })
            .catch(error => {
                console.log(error)
            })
        } else {
            res.redirect('/')
        }
    })
})

app.get('/signup', (req,res) => {
    res.render('signup')
})

app.post('/signup', (req,res) => {
    if(req.body.password === req.body.passwordConfirmation){
        db.user.create({
            username: req.body.username,
            pw: req.body.password,
            characterId: 1
        }).then(result => {
            res.redirect('login')
        })
    }
})

app.get('/logout', (req,res) => {
    db.character.findAll({ order: Sequelize.literal('random()'), limit: 2 })
    .then(characters => {
        res.render('index', { logout: true, characters })
    })
    .catch(error => {
        console.log(error)
    })
})

app.get('/comments/:id', async (req,res) => {
    const comment = await db.comment.findOne({
        where: {
            id: req.params.id
        }
    })
    res.render('comment', { comment })
})

app.put('/comments/:id', async (req,res) => {
    try {
        const comment = await db.comment.findOne({where: { id: req.params.id }})
        comment.content = req.body.content
        comment.save()
        res.redirect(`/details/${comment.characterId}`)
    } catch (error) {
        console.log(error)
    }
})

app.delete('/comments/:id', async (req,res) => {
    try {
        const comment = await db.comment.findOne({ where: { id: req.params.id }})
        let char = comment.characterId
        await comment.destroy()
        res.redirect(`/details/${char}`)
    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, () => {
    console.log(`...listening on :${PORT}`)
})