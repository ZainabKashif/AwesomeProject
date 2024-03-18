const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    author: {
        type: String, // Changing the field name to authorsname
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    url: {
        type: String
    },
    image: {
        type: String,
        require: true,
    },
},
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;