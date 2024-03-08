const mongoose = require('mongoose');

let volcanoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
    },
    location: {
        type: String,
        required: true,
        minLength: 2,
    },
    image: {
        type: String,
        required: true,
        validate: /^https?:\/\//i
    },
    elevation: {
        type: Number,
        required: true,
        minValue: 0,
    },
    lastEruption: {
        type: Number,
        required: true,
        minValue: 0,
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
    },
    type: {
        type: String,
        required: true,
        enum: ['Supervolcanoes', 'Submarine', 'Subglacial', 'Mud', 'Stratovolcanoes', 'Shield']
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    vote: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
});

volcanoSchema.method('getVote', function () {
    return this.vote.map(x => x._id);
})

let Volcano = mongoose.model('Volcano', volcanoSchema);

module.exports = Volcano;