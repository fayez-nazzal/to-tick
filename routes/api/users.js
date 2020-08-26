const express = require('express')
const User = require('../../models/user')
const Group = require('../../models/group')

const router = express.Router()
router.post('/', (req, res, next) => {
    User.create(req.body)
    .then(async user => {
        const group = await Group.create({name: "All"})
        await user.groups.push(group._id)
        await user.save()
        res.json(user)
    })
    .catch(next)
})

router.delete('/:id', (req, res, next) => {
    User.findById(req.params.id)
    .then(user => user.deleteOne())
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router