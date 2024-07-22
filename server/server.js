
const express = require('express');
const mongoose = require('mongoose');
const db = require('./database.js');
const annotation = require('./annotationModel.js');
const storage = require('./storageModel.js');
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

app.get('/api/v1/storages', async (req, res) => {
  const storages = await storage.find({});
  res.send(storages);
});

app.get('/api/v1/storages/storage', async (req, res) => {
  const storageId = req.query.storageId;
  const storages = await storage.find({ _id: storageId });
  res.send(storages[0]);
})

app.post('/api/v1/storages', async (req, res) => {
  const newStorage = new storage(req.body);
  await newStorage.save();
  res.send(newStorage);
});

app.delete('/api/v1/storages/storage', async (req, res) => {
  const storageId = req.query.storageId;
  await storage.deleteOne({ _id: storageId });
  res.send("Deleted"+" "+storageId);
});

app.put('/api/v1/storages/storage', async (req, res) => {
  const storageId = req.query.storageId;
  await storage.updateOne({ _id: storageId }, req.body);
  res.send("Updated"+" "+storageId);
});

app.get('/api/v1/annotations', async (req, res) => {
  const annotations = await annotation.find({});
  res.send(annotations);
});

app.get(
  '/api/v1/annotations/annotation/id', async (req, res) => {
  const annotationId = req.query.annotationId;
  const annotations = await annotation.find({ _id: annotationId });
  res.send(annotations[0]);
});

app.get('/api/v1/annotations/annotation/storage', async (req, res) => {
  const storageId = req.query.storageId;
  const annotations = await annotation.find({ storage_id: storageId });
  res.send(annotations);
});

app.post('/api/v1/annotations', async (req, res) => {
  const newAnnotation = new annotation(req.body);
  await newAnnotation.save();
  res.send(newAnnotation);
});

app.delete('/api/v1/annotations/annotation', async (req, res) => {
  const annotationId = req.query.annotationId;
  await annotation.deleteOne({ _id: annotationId });
  res.send("Deleted"+" "+annotationId);
});

app.put('/api/v1/annotations/annotation', async (req, res) => {
  const annotationId = req.query.annotationId;
  await annotation.updateOne({ _id: annotationId }, req.body);
  res.send("Updated"+" "+annotationId);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
