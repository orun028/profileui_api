const router = require('express').Router()
const request_controler = require('../../controller/request')
const fileUploader = require('../../cloudinary.config');

router.get('/', request_controler.findAll)

router.post('/', fileUploader.single('image'), request_controler.create)

router.get('/:id', request_controler.findById)

module.exports = router