const router = require('express').Router()
const user_controler = require('../../controller/user')
const { validationResult } = require('express-validator')
const validator = require('../../validator/user')
const auth = require('../../utils/auth')

function validatorErr(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ err: errors.array() })
        return;
    }
    next()
}

router.get('/', user_controler.findAll)

router.post('/',  validator.create(), validatorErr, user_controler.create)

router.get('/count', user_controler.countDocument)

router.get("/profile/:username", auth.withOptional, user_controler.profile)

router.post('/login', validator.login(), validatorErr, user_controler.login)

router.get('/logout', user_controler.logout)

router.post('/recover-password', validator.recoverPassword(), validatorErr, user_controler.update);

router.post('/guest', validator.createGuest(), validatorErr, user_controler.create)

router.get("/:id", user_controler.findById)

router.put('/:id', validator.update(), validatorErr, user_controler.update)

router.delete('/:id', user_controler.delete)

module.exports = router