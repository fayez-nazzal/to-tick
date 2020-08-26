const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys')
const User = require('../models/user')
const Group = require('../models/group')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user)
    })
})

passport.use(new GoogleStrategy({
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
 }, (accessToken, refreshToken, profile, done) => {
     console.log('passport callback function fired')
    User.findOne({oauthId: profile.id}).then(user => {
        if (!user)
            User.create({
                displayName: profile.displayName,
                oauthId: profile.id,
                accessToken: accessToken
            }).then( newUser => { 
                Group.create({name: "All"}).then(group => {
                    newUser.groups.push(group._id)
                    newUser.save().then(user => {
                    done(null, user)
                })
                })
            })
        else
            done(null, user)
    })
 })
)