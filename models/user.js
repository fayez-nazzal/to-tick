const mongoose = require('mongoose')
const Tick = require('./ticks')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: String,
    password: String,
    oauthId: String,
    accessToken: String,
    groups: [{
        type: Schema.ObjectId,
        ref: 'Group'
    }],
    todos:[{
        type: Schema.Types.ObjectId,
        ref: 'Todo'
    }]
})

UserSchema.pre('validate', function(next) {
    const isLocal = 'username' in this && 'password' in this
    const isOauth = 'oauthId' in this

    return (isLocal || isOauth)? next() : next(new Error('No provider found'))
})

UserSchema.pre("deleteOne", { document: true }, async function(next) {
    for (let i=0; i<this.groups.length; i++)
        await Group.findOneAndDelete({_id: this.groups[i]._id})
    
    for (let i=0; i<this.todos.length; i++)
        await Tick.findOneAndDelete({_id: this.todos[i]._id})
    next()
})

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel