var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    country: String,
    countryCode: String,
    admin: Boolean,
    points: [String],
    entryDate: Date,
    updated: { type: Date, default: new Date() }
});

module.exports = mongoose.model('User', UserSchema);