const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required:true
    },
    
    email: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    
    content: {
        type: String,
        required: true
    },

    tags: {
        type: String,
        default: "writing,blog,pen,books,paper",
        required: false
    },

    date: {
        type: String,
        required: false
    },

    formdate: {
        type: Date,
        default: Date.now(),
        required: true
    },

    publish: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('Blogs', blogSchema);