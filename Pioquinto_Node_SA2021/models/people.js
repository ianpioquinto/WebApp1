const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const peopleSchema = Schema({
    fullname: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    birthdate: {
        type: String,
        required: true
    }
}, { timestamps: true});

const People = mongoose.model('people', peopleSchema);
module.exports = People;