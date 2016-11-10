import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
import api from './api';
import * as config from './config.json';
const MongoClient = mongodb.MongoClient;

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({error: err});
  return;
});

let db = MongoClient.connect(config.environment.mongourl, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(config.port || 3000, () => {
    console.log('Listening on port ' + config.port);
    app.use(api({ config, db }));
  })
});