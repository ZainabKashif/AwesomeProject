const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    specialization:{
        type: String,
    },
    experience:{
        type: Number,
    },
    education: {
        type: String,
    },
    contact: {
        type: Number,
    },
    bio: {
        type: String,
    },
    ratings: {
        type: [Number],
    },
    CheckOnline:{
        type: Number,
        default: 0,
    },
    verified:{
        type: Boolean,
        default: false
    },
    averageRating:{
        type: Number,
    },
    verificationToken: String,
    isLawyer:{
        type: Boolean,
        default: false
    }

},
{ timestamps:true}
);

const User = mongoose.model("User", userSchema);
module.exports = User;