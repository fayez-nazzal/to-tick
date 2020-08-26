const mongoose = require('mongoose')

const Schema = mongoose.Schema

const NanoTickSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Tick'
    }
})

const NanoTick = mongoose.model('NanoTick', NanoTickSchema)

module.exports = NanoTick