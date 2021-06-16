const express = require('express')
const db = require('../models')
const router = express.Router()
const axios = require('axios')

router.get('/:id', async (req,res) => {
    try {
        const character = await db.character.findOne({
            where: { id: req.params.id },
        })
        const comments = await db.comment.findAll({
            where: { characterId: req.params.id},
            include: [db.user]
        }) 
        res.render('details', { character, comments })
    } catch (error) {
        console.log(error)
    }
})

router.post('/:id/comments', async (req,res) => {
    try {
        let user = await db.user.findOne({
            where: {
                username: req.body.name
            }
        })
        let content = await axios.get(`https://www.purgomalum.com/service/json?text=${req.body.content}`)
        console.log(content)
        await db.comment.create({
            userId: user.id,
            content: content.data.result,
            characterId: req.params.id
        })
        res.redirect(`/details/${req.params.id}`)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router