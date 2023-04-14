const mongoose = require('mongoose')

mongoose.set('strictQuery', false);
const conn = mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(m => m.connection.getClient())

module.exports = conn