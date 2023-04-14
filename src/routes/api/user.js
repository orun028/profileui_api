const router = require('express').Router()
const user_controler = require('../../controller/user')

router.get('/', user_controler.findAll)

router.post('/', user_controler.create)

router.get('/:id', user_controler.findById)

router.put('/:id', user_controler.update)

router.delete('/:id', user_controler.delete)

module.exports = router