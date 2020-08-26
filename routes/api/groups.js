const express = require ('express')
const router = express.Router()
const Group = require('../../models/group')


router.post('/', (req, res, next) => {
  if(req.body){
    Group.create(req.body)
      .then(data => res.json(data))
      .catch(next)
  } else {
    res.json({error: "empty"})
  }
})

router.delete('/:id', (req, res, next)=>{
  console.log("called")
  Group.findOne({"_id": req.params.id})
  .then(group => group.deleteOne())
  .then(data => res.json(data))
  .catch(next)
})

module.exports = router