const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Person', personSchema);