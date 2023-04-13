const User = require('../model/user')
const passport = require('passport');

exports.login = (req, res, next) => {
    passport.authenticate('user_local', { session: false }, (err, user, info) => {
        if (err) { return next(err); }
        if (user) {
            return res.json(user.toAuthJSON());
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
}

exports.profile = (req, res, next) => {
    User.findOne({username: req.params.username})
    .then(function (user) {
        if (!user || !req.auth.id == user._id) { return res.status(404).json({err: "Not found"}) }
        req.profile = user
        return res.json(req.profile.toProfileJSONFor(user));
    })
    .catch(next)
}

exports.loginGoogle = (req, res, next) => {
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    })
        .catch(next)
}

exports.loginGoogleCallback = (req, res, next) => {
    passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
    })
        .catch(next)
}

exports.logout = (req, res, next) => {
    res.logout()
    res.status(205)
}

exports.create = (req, res, next) => {
    const { road, district, city} = req.body
    const values = req.body
    if(road){
        values = {
            ...values,
            address: [{
                road: road,
                district: district,
                city: city
            }]
        }
    }
    const user = new User(values)
    user.save()
        .then(v => {
            res.status(201).json(v.toAuthJSON())
        })
        .catch(next)
}

exports.update = (req, res, next) => {
    User.init()
        .then(v => v.findByIdAndUpdate(req.params.id, req.body, { new: true }))
        .then(v => {
            res.json(v)
        })
        .catch(next)
}

exports.delete = (req, res, next) => {
    console.log(req.params.id)
    User.deleteOne({ _id: req.params.id })
        .then(e => {
            res.status(204).json(e)
        })
        .catch(next)
}

exports.findById = (req, res, next) => {
    User.findById(req.params.id)
        .then(v => {
            res.json(v)
        })
        .catch(next)
}

exports.countDocument = (req, res, next) => {
    User.estimatedDocumentCount()
        .then(v => {
            res.json({ counts: v })
        })
        .catch(next)
}

exports.findAll = (req, res, next) => {
    let page = req.query.page;
    let limit = req.query.limit || 10;
    if (page) {
        page = parseInt(page)
        page < 1 ? page = 1 : null
        const skipPage = (page - 1) * limit
        delete req.query.page

        User.find(req.query)
            .skip(skipPage)
            .limit(limit)
            .then(v => {
                User.countDocuments().then(total => {
                    const page = Math.ceil(total / limit)
                    res.json({
                        total: total,
                        page: page,
                        limit: limit,
                        data: v
                    });
                })
            })
            .catch(next)
    } else {
        User.find(req.query)
            .then(v => {
                res.json(v)
            })
            .catch(next)
    }
}