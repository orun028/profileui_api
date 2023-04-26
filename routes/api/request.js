const router = require('express').Router()
const request_controler = require('../../controller/request')

router.get('/', request_controler.findAll)

router.post('/', request_controler.create)

router.get('/:id', request_controler.findById)

module.exports = router