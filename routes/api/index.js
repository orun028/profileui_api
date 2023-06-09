const router = require('express').Router();
const auth = require('./../../utils/auth')

router.use('/auth', require('./auth'));
router.use('/users', auth.required, require('./user'));
router.use('/requests', auth.optional, require('./request'));

router.use(function (err, req, res, next) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
        return res.status(422).json({ err: 'There was a duplicate key error' })
    }
    if (err.name === 'ValidationError') {
        return res.status(422).json({
            err: Object.keys(err.errors).reduce(function (errors, key) {
                errors[key] = err.errors[key].message;
                return errors;
            }, {})
        });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({err: 'invalid token...'});
    }
    return next(err);
});

router.use(function (err, req, res, next) {
    console.log(err)
    res.status(500).json({ 
        name: err.name,
        message: 'Something broke!' 
    })
})

module.exports = router;