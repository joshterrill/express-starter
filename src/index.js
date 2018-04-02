const express = require('express');
const app = express();
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const MongoClient = mongodb.MongoClient;
const serverPort = process.env.PORT || 3000;
const dotenv = require('dotenv').config();

const api = require('./api');
const crud = require('./api/crud');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  next();
});

let db = MongoClient.connect(process.env.MONGODB_URL, (err, client) => {
  if (err) return console.log(err)
  db = client.db(process.env.MONGODB_DB);
  app.listen(serverPort, () => {
    console.log(`Listening on port ${serverPort}`);
    app.use(api());
    app.use(crud('user', db));
  });
});