const Router = require('express').Router;

module.exports = (context, model) => {
  const crud = Router();

  crud.get(`/${context}`, async (req, res) => {
    try {
      const data = await model.find({});
      res.json({
        data,
        error: null
      });
    } catch (non) {
      const error = `Error getting all '${context}'`;
      res.json({data: null, error});
    }
  });

  crud.get(`/${context}/:query`, async (req, res) => {
    // check to see if were filtering or getting by an ID
    if (req.params.query.indexOf('{') === 0) {
      try {
        const filter = JSON.parse(req.params.query);
        const data = await model.find(filter);
        res.json({
          data,
          error: null
        });
      } catch (non) {
        const error = `Error getting ${req.params.query} from '${context}'`;
        res.json({data: null, error});
      }
    } else {
      const _id = req.params.query;
      try {
        const data = await model.findOne({_id});
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

  crud.put(`/${context}/:id`, async (req, res) => {
    const body = req.body;
    delete body._id;
    const _id = req.params.id;
    try {
      const results = await model.update({_id}, body, { upsert: true });
      const data = await model.findOne({_id})
      res.json({
        data,
        error: null
      });
    } catch (non) {
      const error = `Error updating ${_id} from '${context}'`;
      res.json({data: null, error});
    }
  });

  crud.put(`/${context}/:id/:field`, async (req, res) => {
    const body = req.body;
    const _id = req.params.id;
    const field = req.params.field;
    try {
      const results = await model.update({_id},{$set: {[field]: body[field]}}, { upsert: true });
      const data = await model.findOne({_id});
      res.json({
        data,
        error: null
      });
    } catch (non) {
      const error = `Error updating ${_id} from '${context}'`;
      res.json({data: null, error});
    }
  });

  crud.post(`/${context}`, async (req, res) => {
    const body = req.body;
    try {
      const results = await model.insertOne(body);
      const data = await model.findOne({_id: results.insertedId});
      res.json({
        data,
        error: null
      });
    } catch (non) {
      const error = `Error creating ${JSON.stringify(body)} from '${context}'`;
      res.json({data: null, error});
    }
  });

  crud.delete(`/${context}/:id`, async (req, res) => {
    const _id = req.params.id;
    try {
      const results = await model.deleteOne({_id});
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