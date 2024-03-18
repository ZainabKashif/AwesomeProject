const mongoose = require('mongoose');

const lawyerProfileSchema = new mongoose.Schema({
    name : {
        type: String,
        require: true,
    },
    email : {
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
        require: true,
    },
    experience:{
        type: Number,
    },
    education: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true,
    },
    bio: {
        type: String,
    },
    ratings: {
        type: [Number],
    },
    verified:{
        type: Boolean,
        default: false
    },
    verificationToken: String,
    averageRating:{
        type: Number,
    }
});
const LawyerProfile = mongoose.model('LawyerProfile', lawyerProfileSchema);
module.exports = LawyerProfile;  