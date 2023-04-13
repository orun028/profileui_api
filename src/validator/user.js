const { check } = require('express-validator');

function create(){
  return [
    check('email', 'Please enter your email').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('name', 'Please enter your name').not().isEmpty(),
    check('name', 'Name more than 6 degits').isLength({ min: 6, max: 20 }),
    check('password', 'Please enter your password').not().isEmpty(),
    check('password', 'Password more than 6 degits').isLength({ min: 6, max: 30 }),
    check('phone', 'Please enter your phone').not().isEmpty(),
    check('phone', 'Invalid phone').isLength({ min: 10 })
  ];
}

function createGuest(){
  return [
    check('email', 'Please enter your email').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('name', 'Please enter your name').not().isEmpty(),
    check('name', 'Name more than 6 degits').isLength({ min: 6, max: 20 }),
  ];
}

function login(){
  return [
    check('username', 'Please enter your username').not().isEmpty(),
    check('password', 'Please enter your password').not().isEmpty()
  ];
}

function update(){
  return [
    check('email', 'Please enter your email').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('name', 'Please enter your name').not().isEmpty(),
    check('name', 'Name more than 20 degits').isLength({ min: 20 }),
    check('phone', 'Please enter your phone').not().isEmpty(),
    check('phone', 'Invalid phone').isLength({ min: 10 })
  ];
}

function recoverPassword(){
  return [
    check('email', 'Please enter your email').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('newPassword', 'Please enter your phone').not().isEmpty(),
    check('newPassword', 'Password more than 6 degits').isLength({ min: 6, max: 30 }),
  ];
}

const checks = {
  recoverPassword,
  update,
  login,
  createGuest,
  create
}

module.exports = checks