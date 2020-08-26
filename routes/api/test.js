const express = require ('express')
const router = express.Router()
const User = require('../../models/user')
const mongoose = require('mongoose')


router.get('/users', async (req, res, next) => {
    res.send(req.user)
})

module.exports = router