const mongoose = require('mongoose');
const annotationSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true,
        },
        storage_id: String,
        top: String,
        left: String,
        height: String,
        width: String,
        label: String,
        content: Array
            
    }
);

const annotationModel = mongoose.model('annotation-collection', annotationSchema);
module.exports = annotationModel;
