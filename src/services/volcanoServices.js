const Volcano = require('../models/Volcano');

exports.create = (volcanoData) => Volcano.create(volcanoData);

exports.getAll = () => Volcano.find().lean();

exports.getOne = (volcanoId) => Volcano.findById(volcanoId).populate('vote');

exports.delete = (volcanoId) => Volcano.findByIdAndDelete(volcanoId);

exports.updateOne = (volcanoId, volcanoData) => Volcano.findByIdAndUpdate(volcanoId, volcanoData);

exports.search = (volcanoText, volcanoType) => {
    if (volcanoText) {
        return (Volcano.find({ name: {$regex: volcanoText, $options: 'i'} }).lean());
    }

    if (!volcanoText && volcanoType) {
        return (Volcano.find({ type: volcanoType }).lean());
    }

}