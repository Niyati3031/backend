const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    image: [{
        type: String,
        required: true,
    }],
    title: String,
    desc: String,
    tags: [{
        type: String
    }],
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    }
});

const Car = mongoose.model("Car", carSchema);

module.exports = { Car };