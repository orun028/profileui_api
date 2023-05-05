const Request = require('../model/request')

exports.create = async (req, res, next) => {
    const values = req.body
    try {
        const request = new Request({...values, image: req.file.path});
        const results = await request.save()
        res.json(results)
    } catch (error) {
        next(error)
    }
}

exports.findById = (req, res, next) => {
    Request.findById(req.params.id)
        .then(v => res.json(v))
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

        Request.find(req.query)
            .skip(skipPage)
            .limit(limit)
            .then(v => {
                Request.countDocuments().then(total => {
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
        Request.find(req.query)
            .then(v => {
                res.json(v)
            })
            .catch(next)
    }
}