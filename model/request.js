const mongoose = require('mongoose');

const request = new mongoose.Schema({
    userid: String,
    latitude: String,
    longitude: String,
    ssid: String,
    type: String,
    image: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('requests', request);