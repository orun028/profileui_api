const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const user = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, lowercase: true, required: [true, "email is required"], match: [/\S+@\S+\.\S+/, 'email is invalid'], index: { unique: true }, maxlength: 20 },
    password: { type: String, default: null, maxlength: 30 },
    phone: { type: String, required: false, index: { unique: true, sparse: true }, maxlength: 10 },
    isconfirmed: { type: Boolean, default: false },
    address: { type: String },
}, { timestamps: true });


user.pre('save', async function (next) {
    if(await this.address[0]){
        this.addressActive = this.address[0]._id
    }
    next();
});

user.pre('save' || 'findByIdAndUpdate', async function (next) {
    if (this.password) this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    if (this.name && this.email && !this.password && !this.confirmed) {
        await Role.findOne({ code: 'role_user_public' })
            .then(e => this.role = e._id)
            .catch(next)
    } else if(this.name && this.email ) {
        await Role.findOne({ code: 'role_user_auth' })
            .then(e => this.role = e._id)
            .catch(next)
    }
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
        }, process.env.APP_SECRET || "ruxx28");
    },
    toAuthJSON: function () {
        return {
            id: this._id,
            name: this.name,
            token: this.generateJWT()
        }
    },
    toProfileJSONFor: function (user) {
        return {
            name: this.name,
            image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
            following: false
        };
    }
})

module.exports = mongoose.model('user', user);