const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    images: [{
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;