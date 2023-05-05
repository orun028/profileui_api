const router = require('express').Router();
const auth_controler = require('../../controller/auth')

router.post('/local', auth_controler.login);

router.get('/google',auth_controler.loginGoogle);

router.get('/google/callback', auth_controler.loginGoogleCallback);

router.get('/logout', auth_controler.logout)

module.exports = router;