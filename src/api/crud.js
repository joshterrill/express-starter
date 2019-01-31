const Router = require('express').Router;
const mongodb = require('mongodb');

module.exports = (context, db) => {
  const crud = Router();

  crud.get(`/api/crud/${context}`, async (req, res) => {
    try {
      const data = await db.collection(context).find({}).toArray();
      res.json({
        data,
        error: null
      });
    } catch (non) {
      const error = `Error getting all '${context}'`;
      res.json({data: null, error});
    }
  });

  crud.get(`/api/crud/${context}/:query`, async (req, res) => {
    // check to see if were filtering or getting by an ID
    if (req.params.query.indexOf('{') === 0) {
      const filter = JSON.parse(req.params.query);
      try {
        const data = await db.collection(context).find(filter).toArray();
        res.json({
          data,
          error: null
        });
      } catch (non) {
        const error = `Error getting ${_id} from '${context}'`;
        res.json({data: null, error});
      }
    } else {
      const _id = req.params.query;
      try {
        const data = db.collection(context).findOne({_id: new mongodb.ObjectID(_id)});
        res.json({
          data,
          error: null
        });
      } catch (non) {
        const error = `Error getting ${_id} from '${context}'`;
        res.json({data: null, error});
      }
    }
  });

  crud.put(`/api/crud/${context}/:id`, async (req, res) => {
    const body = req.body;
    delete body._id;
    const _id = req.params.id;
    try {
      const results = await db.collection(context).update({_id: new mongodb.ObjectID(_id)}, body, { upsert: true });
      const data = await db.collection(context).findOne({_id: new mongodb.ObjectID(_id)})
      res.json({
        data,
        error: null
      });
    } catch (non) {
      const error = `Error updating ${_id} from '${context}'`;
      res.json({data: null, error});
    }
  });

  crud.put(`/api/crud/${context}/:id/:field`, async (req, res) => {
    const body = req.body;
    const _id = req.params.id;
    const field = req.params.field;
    try {
      const results = await db.collection(context).update({_id: new mongodb.ObjectID(_id)},{$set: {[field]: body[field]}}, { upsert: true });
      const data = await db.collection(context).findOne({_id: new mongodb.ObjectID(_id)});
      res.json({
        data,
        error: null
      });
    } catch (non) {
      const error = `Error updating ${_id} from '${context}'`;
      res.json({data: null, error});
    }
  });

  crud.post(`/api/crud/${context}`, async (req, res) => {
    const body = req.body;
    try {
      const results = await db.collection(context).insertOne(body);
      const data = await db.collection(context).findOne({_id: new mongodb.ObjectID(results.insertedId)});
      res.json({
        data,
        error: null
      });
    } catch (non) {
      const error = `Error creating ${JSON.stringify(body)} from '${context}'`;
      res.json({data: null, error});
    }
  });

  crud.delete(`/api/crud/${context}/:id`, async (req, res) => {
    const _id = req.params.id;
    try {
      const results = await db.collection(context).deleteOne({_id: new mongodb.ObjectID(_id)});
      res.json({
        data: {_id},
        error: null
      });
    } catch (non) {
      const error = `Error deleting ${_id} from '${context}'`;
      res.json({data: null, error});
    }
  });

  return crud;
}