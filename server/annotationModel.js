const mongoose = require('mongoose');
const annotationSchema = new mongoose.Schema(
    {
        storage: String,
        annotations: Array
    }
);

const annotationModel = mongoose.model('annotations', annotationSchema);
module.exports = annotationModel;
