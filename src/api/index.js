const Router = require('express').Router;
const mongodb = require('mongodb');
const apiVersion = require('../../package.json').version;

module.exports = () => {
  const api = Router();

  api.get('/', (req, res) => {  
  	res.json({api: apiVersion});
  });

  return api;
}