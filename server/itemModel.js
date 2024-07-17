const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({
    name: String,
    image: String,
    category: String,
})

const itemModel = mongoose.model('items', itemSchema);
module.exports = itemModel;