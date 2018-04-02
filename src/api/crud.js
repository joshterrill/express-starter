const Router = require('express').Router;
const mongodb = require('mongodb');

module.exports = (context, db) => {
  const crud = Router();

  crud.get(`/api/crud/${context}`, (req, res) => {
    db.collection(context).find({}).toArray().then((data) => {
      res.json({
        data,
        error: null
      });
    }).catch((non) => {
      const error = `Error getting all '${context}'`;
      res.json({data: null, error});
    });
  });

  crud.get(`/api/crud/${context}/:query`, (req, res) => {
    // check to see if were filtering or getting by an ID
    if (req.params.query.indexOf('{') === 0) {
      const filter = JSON.parse(req.params.query);
      db.collection(context).find(filter).toArray().then((data) => {
        res.json({
          data,
          error: null
        });
      }).catch((non) => {
        const error = `Error getting ${_id} from '${context}'`;
        res.json({data: null, error});
      });
    } else {
      const _id = req.params.query;
      db.collection(context).findOne({_id: new mongodb.ObjectID(_id)}).then((data) => {
        res.json({
          data,
          error: null
        });
      }).catch((non) => {
        const error = `Error getting ${_id} from '${context}'`;
        res.json({data: null, error});
      });
    }
  });

  crud.put(`/api/crud/${context}/:id`, (req, res) => {
    const body = req.body;
    delete body._id;
    const _id = req.params.id;
    const field = req.params.field;
    db.collection(context).update({_id: new mongodb.ObjectID(_id)}, body, { upsert: true }).then((results) => {
      db.collection(context).findOne({_id: new mongodb.ObjectID(_id)}).then((data) => {
        res.json({
          data,
          error: null
        });
      });
    }).catch((non) => {
      const error = `Error updating ${_id} from '${context}'`;
      res.json({data: null, error});
    });
  });

  crud.put(`/api/crud/${context}/:id/:field`, (req, res) => {
    const body = req.body;
    const _id = req.params.id;
    const field = req.params.field;
    db.collection(context).update({_id: new mongodb.ObjectID(_id)},{$set: {[field]: body[field]}}, { upsert: true }).then((results) => {
      db.collection(context).findOne({_id: new mongodb.ObjectID(_id)}).then((data) => {
        res.json({
          data,
          error: null
        });
      });
    }).catch((non) => {
      const error = `Error updating ${_id} from '${context}'`;
      res.json({data: null, error});
    });
  });

  crud.post(`/api/crud/${context}`, (req, res) => {
    const body = req.body;
    db.collection(context).insertOne(body).then((results) => {
      db.collection(context).findOne({_id: new mongodb.ObjectID(results.insertedId)}).then((data) => {
        res.json({
          data,
          error: null
        });
      });
    }).catch((non) => {
      const error = `Error creating ${JSON.stringify(body)} from '${context}'`;
      res.json({data: null, error});
    });
  });

  crud.delete(`/api/crud/${context}/:id`, (req, res) => {
    const _id = req.params.id;
    db.collection(context).deleteOne({_id: new mongodb.ObjectID(_id)}).then((results) => {
      res.json({
        data: {_id},
        error: null
      });
    }).catch((non) => {
      const error = `Error deleting ${_id} from '${context}'`;
      res.json({data: null, error});
    });
  });

  return crud;
}