'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Poll = new Schema({
    // _id: String,
    user_id: String,
    user_name: String,
    question: String,
    options: [
        { answer: String, count: Number }
    ]
});

module.exports = mongoose.model('Poll', Poll);