const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const user = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, "is invalid"],
        index: true
    },
    username: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, "is invalid"],
        index: true
    },
    password: {
        type: String,
        default: null,
        maxlength: 30
    },
    phone: {
        type: String,
        maxlength: 10,
        default: null,
    },
    address: { type: String },
    isconfirmed: { type: Boolean, default: false },
    photourl: { type: String },
    googleid: { type: String, default: null },
}, { timestamps: true });

user.index({ phone: 1 }, {
    name: 'phone_1_unique',
    partialFilterExpression: {
        $and: [
            { phone: { $type: 'string' } },
            { state: { $eq: 0 } }
        ]
    },
    unique: true
})

user.pre('save' || 'findByIdAndUpdate', async function (next) {
    if (this.password) this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    next();
});

user.method({
    validPassword: function (password) {
        return bcrypt.compare(password, this.password)
    },
    generateJWT: function () {
        var today = new Date();
        var exp = new Date(today);
        exp.setDate(today.getDate() + 60)

        return jwt.sign({
            id: this._id,
            name: this.name,
            exp: parseInt(exp.getTime() / 1000),
        }, process.env.SECRET);
    },
    toAuthJSON: function () {
        return {
            id: this._id,
            fullname: this.fullname,
            username: this.username,
            email: this.email,
            photourl: this.photourl,
            token: this.generateJWT()
        }
    },
    toProfileJSONFor: function () {
        return {
            id: this._id,
            fullname: this.fullname,
            username: this.username,
            email: this.email,
            photourl: this.photourl,
        };
    }
})

module.exports = mongoose.model('users', user);