
const express = require('express');
const mongoose = require('mongoose');
const db = require('./database.js');
const annotation = require('./annotationModel.js');
var cors = require('cors');
var corsOptions = {
    origin: '*'
  }
  const app = express();
app.use(cors(corsOptions));
app.use(express.json());
const port = 3000;

app.get('/', (req, res) => {
  res.send("hello world");
});

app.get('/getAnnotations', async (req, res) => {
  let storage = req.query.storage;
  console.log(storage);
  let annotations = await annotation.find({storage: storage});
  res.send(annotations);
})

app.post('/newAnnotations', (req, res)=>{
  // let body = req.body;
  let query = {'storage': req.body.storage}
  annotation.findOneAndUpdate(query, req.body, {upsert: true})
  .then((data)=>{
    res.statusCode = 201;
    console.log("annotations created", data);
    res.send("annotations created");
  })
  .catch((err)=>{
    res.statusCode = 500;
    res.send("error creating annotations");
  });
      
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
