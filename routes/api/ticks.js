const express = require ('express')
const router = express.Router()
const Tick = require('../../models/ticks')
const Group = require('../../models/group')
const User = require('../../models/user')

router.post('/', async (req, res, next) => {
    if (!req.body) return res.status(404).json({error: "empty body"})
    const user = req.user
    if (!user)
      return res.status(404).json({err: "user not found"}) 
    if (!req.body.group_id && !req.body.project_id)
      return res.status(400).json({err: "no group or project provided"}) 

    const todo = await Tick.create({...req.body, owner: user._id})
    await user.todos.push(todo._id)
    await user.save()
    res.status(201).end()
    next()
  })
  
router.put('/:id', (req, res, next) => {
    Tick.findOneAndUpdate({_id: req.params.id }, req.body)
        .then(data => res.json(data))
        .then(next)
})

router.delete('/:id', (req, res, next) => {
    Tick.findOneAndDelete({"_id": req.params.id})
        .then(data => res.json(data))
        .catch(next)
})

module.exports = router