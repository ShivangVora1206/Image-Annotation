const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/image-annotations', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() =>{console.log('Connected to MongoDB')})
.catch((err) => {console.log(err)});

module.exports = mongoose;