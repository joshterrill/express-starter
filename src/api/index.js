import { Router } from 'express';
import mongodb from 'mongodb';

export default ({ config, db }) => {
  const api = Router();

  api.get('/', (req, res) => {  
  	res.json({api: true});
  });

  api.get('/test/:number', (req, res) => {
    res.json({number: req.params.number});
  });

  api.get('/api/findAll', (req, res) => {
    db.collection('MongoCollection').find({}).toArray((err, results) => {
      if (err) res.json({error: err})
      res.json(results);
    });
  });

  api.get('/api/findById/:id', (req, res) => {
    db.collection('MongoCollection').findOne({_id: new mongodb.ObjectID(req.params.id)}, (err, results) => {
      if (err) res.json({error: err})
      res.json(results);
    });
  });

  api.post('/api/add', (req, res) => {
    db.collection('MongoCollection').save(req.body, (err, result) => {
      if (err) res.json({error: err})
      res.json(result);
    });
  });

  api.delete('/api/delete/:id', (req, res) => {
    db.collection('MongoCollection').remove({_id: new mongodb.ObjectID(req.params.id)}, (err, result) => {
      if (err) res.json({error: err})
      res.json(result);
    });
  });

  return api;
}