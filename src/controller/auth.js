const Admin = require('../model/admin')
const passport = require('passport')

exports.login = (req, res, next) => {
    passport.authenticate('admin_local', { session: false }, (err, admin, info) => {
        if (err) { return next(err); }
        if (admin) {
            return res.json(admin.toAuthJSON());
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
}

exports.profile = (req, res, next) => {
    Admin.findOne({email: req.params.email})
    .then(function (admin) {
        if (!admin || !req.auth.id == admin._id) { return res.status(404).json({err: "Not found"}) }
        req.profile = admin
        return res.json(req.profile.toProfileJSONFor(admin));
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
    res.status(205).json({})
}

exports.recoverPassword = (req, res, next) => {
    res.json({})
}

exports.create = (req, res, next) => {
    const admin = new Admin(req.body)
    admin.save(req.body)
        .then(v => {
            res.status(201).json(v.toAuthJSON())
        })
        .catch(next)
}

exports.update = (req, res, next) => {
    Admin.init()
        .then(v => v.findByIdAndUpdate(req.params.id, req.body, { new: true }))
        .then(v => {
            res.json(v)
        })
        .catch(next)
}

exports.delete = (req, res, next) => {
    Admin.deleteOne({ _id: req.params.id })
        .then(() => {
            res.status(204).json({})
        })
        .catch(next)
}

exports.findById = (req, res, next) => {
    Admin.findById(req.params.id)
        .then(v => {
            res.json(v)
        })
        .catch(next)
}

exports.countDocument = (req, res, next) => {
    const count = Admin.countDocuments()
    res.json({counts: count})
}

exports.findAll = (req, res, next) => {
    let page = req.query.page;
    let limit = req.query.limit || 10;
    if (page) {
        page = parseInt(page)
        page < 1 ? page = 1 : null
        const skipPage = (page - 1) * limit
        delete req.query.page

        Admin.find(req.query)
            .skip(skipPage)
            .limit(limit)
            .then(v => {
                Admin.countDocuments().then(total => {
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
        Admin.find(req.query)
            .then(v => {
                res.json(v)
            })
            .catch(next)
    }
}