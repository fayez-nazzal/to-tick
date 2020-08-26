const express = require ('express')
const router = express.Router()
const User = require('../../models/user')

router.get('/', async (req, res, next) => {
    const user = req.user
    if (user)
        res.json(await User.findById(req.user._id).populate('todos'))
    res.status(404).end()
})

module.exports = router