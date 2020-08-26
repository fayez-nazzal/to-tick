const mongoose = require('mongoose')

const Schema = mongoose.Schema

const GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const GroupModel = mongoose.model('Group', GroupSchema)

module.exports = GroupModel