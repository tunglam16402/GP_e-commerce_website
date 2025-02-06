const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        numberViews: {
            type: Number,
            default: 0,
        },
        likes: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
        dislikes: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
        images: {
            type: Array,
            default: 'https://tse3.mm.bing.net/th?id=OIP.jeIZbiXiDT0YeHnsFCDUEgHaDl&pid=Api&P=0&h=220',
        },
        author: {
            type: String,
            default: 'Admin',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

//Export the model
module.exports = mongoose.model('Blog', blogSchema);
