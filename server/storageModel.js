const mongoose = require('mongoose');
const storageSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            // index: true,
            required: true,
            auto: true,
        },
        name: String,
    }
);

const storageModel = mongoose.model('storage-collection', storageSchema);
module.exports = storageModel;