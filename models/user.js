var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    display_name: { type: String, required: true },
    age: { type: String, required: true },
    job_title: { type: String, required: true },
    height_in_cm: { type: Number, required: true },
    city: {
        name: { type: String, required: true },
        lat: Number,
        lon: Number
    },
    geo: {
        type: [Number],         //has to be [<longitude>, <latitude>]
        index: '2d'
    },
    main_photo: String,
    compatibility_score: { type: Number, required: true },
    contacts_exchanged: Number,
    favourite: Boolean,
    religion: String
});

module.exports = mongoose.model("User", userSchema);