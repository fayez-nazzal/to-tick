const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema

const TickSchema = new Schema({
    text: {
        type: String,
        required: [true, 'This field is required (todo.text)']
    },
    creationDate: {
        type: Date,
        default: moment.utc()
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    ticklist: [{
        type: Schema.Types.ObjectId,
        ref: 'NanoTick'
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    due: {
        type: Date
    },
    priority: Number
})

const TickModel = mongoose.model('Todo', TickSchema)

module.exports = TickModel