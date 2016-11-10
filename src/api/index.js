import { Router } from 'express';
import mongodb from 'mongodb';

export default ({ config, db }) => {
  const api = Router();

  api.get('/', (req, res) => {  
  	res.json({api: true});
  });

  api.get('/test/:number', (req, res) => {
  	var number = req.params.number;
    res.json({number: number});
  });

  api.get('/api/findAll', (req, res) => {
    db.collection('MongoCollection').find({}).toArray((err, results) => {
      res.json(results);
    });
  });

  api.get('/api/findById/:id', (req, res) => {
    db.collection('MongoCollection').findOne({_id: new mongodb.ObjectID(req.params.id)}, (err, results) => {
      res.json(results);
    });
  });

  api.post('/api/add', (req, res) => {
    db.collection('MongoCollection').save(req.body, (err, result) => {
      res.json(result);
    });
  });

  api.delete('/api/delete/:id', (req, res) => {
    db.collection('MongoCollection').remove({_id: new mongodb.ObjectID(req.params.id)}, (err, result) => {
      res.json(result);
    });
  });

  return api;
}