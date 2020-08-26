const express = require('express')
const passport =  require('passport')
const { authenticate } = require('passport')

const router = express.Router()

router.get('/login/:provider', (req, res) => {
    if ('user' in req) {
        res.redirect('http://localhost:3000')
    } else {
        res.redirect(`http://localhost:5000/auth/${req.params.provider}`)
    }
})

router.get('/logout', (req, res) => {
    
})

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('http://localhost:3000')
})

module.exports = router