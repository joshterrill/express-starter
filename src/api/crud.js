const Router = require('express').Router;

module.exports = (context, model) => {
  const crud = Router();

  crud.get(`/${context}`, async (req, res) => {
    try {
      const data = await model.find({});
      res.json({
        data,
        error: null,
        success: true,
      });
    } catch (non) {
      console.log(non);
      const error = `Error getting all '${context}'`;
      res.json({data: null, error, success: false});
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
          error: null,
          success: true,
        });
      } catch (non) {
        console.log(non);
        const error = `Error getting ${req.params.query} from '${context}'`;
        res.json({data: null, error, success: false});
      }
    } else {
      const _id = req.params.query;
      try {
        const data = await model.findOne({_id});
        res.json({
          data,
          error: null,
          success: true,
        });
      } catch (non) {
        console.log(non);
        const error = `Error getting ${_id} from '${context}'`;
        res.json({data: null, error, success: false});
      }
    }
  });

  crud.get(`/${context}/orderBy/createdOn/:ascTrue`, async (req, res) => {
    try {
      const direction = req.params.ascTrue === 'true' ? 1 : -1;
      const { pageNumber, size } = req.query;
      const skip = +size * (+pageNumber - 1);
      const data = await model.find().skip(+skip).limit(+size).sort({createdOn: direction});
      res.json({
        data,
        error: null,
        success: true,
      });
    } catch (non) {
      console.log(non);
      const error = `Error getting ${context}`;
      res.json({data: null, error, success: false});
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
        error: null,
        success: true,
      });
    } catch (non) {
      console.log(non);
      const error = `Error updating ${_id} from '${context}'`;
      res.json({data: null, error, success: false});
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
        error: null,
        success: true,
      });
    } catch (non) {
      console.log(non);
      const error = `Error updating ${_id} from '${context}'`;
      res.json({data: null, error, success: false});
    }
  });

  crud.post(`/${context}`, async (req, res) => {
    const body = req.body;
    try {
      const results = await model.create(body);
      const data = await model.findOne({_id: results._id});
      res.json({
        data,
        error: null,
        success: true,
      });
    } catch (non) {
      console.log(non);
      const error = `Error creating ${JSON.stringify(body)} from '${context}'`;
      res.json({data: null, error, success: false});
    }
  });

  crud.delete(`/${context}/:id`, async (req, res) => {
    const _id = req.params.id;
    try {
      const results = await model.deleteOne({_id});
      res.json({
        data: {_id},
        error: null,
        success: true,
      });
    } catch (non) {
      console.log(non);
      const error = `Error deleting ${_id} from '${context}'`;
      res.json({data: null, error, success: false});
    }
  });

  return crud;
}