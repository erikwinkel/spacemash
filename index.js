// requirements
require('dotenv').config()
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const { Sequelize } = require('sequelize')
const db = require('./models')


// config
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')

// middlewares
app.use(ejsLayouts)

// routes

app.get('/', (req,res) => {
    db.character.findAll({ order: Sequelize.literal('random()'), limit: 2 })
    .then(characters => {
        console.log(characters)
        res.render('index', { characters })
    })
    .catch(error => {
        console.log(error)
    })

})



app.listen(PORT, () => {
    console.log(`...listening on :${PORT}`)
})