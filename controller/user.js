const User = require('../model/user')

exports.create = (req, res, next) => {
    const values = req.body
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