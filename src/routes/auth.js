const router = require('express').Router();
const passport = require('passport')

router.use('/google',
  passport.authenticate('google', {
    scope: ['email', 'profile']
  }
  ));
  
  router.use('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
  }));


module.exports = router;