var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    display_name: String,
    age: String,
    job_title: String,
    height_in_cm: Number,
    city: {
        name: String,
        lat: Number,
        lon: Number
    },
    geo: {
        type: [Number],         //has to be [<longitude>, <latitude>]
        index: '2d'
    },
    main_photo: String,
    compatibility_score: Number,
    contacts_exchanged: Number,
    favourite: Boolean,
    religion: String
});

module.exports = mongoose.model("User", userSchema);