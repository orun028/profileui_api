const jwt = require('express-jwt');
const privateKey = process.env.SECRET

function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}

const auth = {
    required: jwt({
        secret: privateKey,
        algorithms: ['HS256'],
        requestProperty: 'auth',
        getToken: fromHeaderOrQuerystring
    }),
    optional: jwt({
        secret: privateKey,
        algorithms: ['HS256'],
        credentialsRequired: false,
        requestProperty: 'auth',
        getToken: fromHeaderOrQuerystring
    })
};

module.exports = auth;