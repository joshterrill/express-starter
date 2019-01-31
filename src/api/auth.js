const Router = require('express').Router;
const UserModel = require('../model/User');
const utility = require('../utilities');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
  const api = Router();

  api.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({email})
      if (user) {
        res.json({success: false, error: 'Email already exists', data: null});
      } else {
        password = utility.encryptPassword(password);
        const user = await UserModel.create({
          email,
          password,
          createdOn: new Date(),
          lastLoginOn: null,
          permissions: ['user'],
        });
        res.json({success: true, error: null, data: {user}});
      }
    } catch (error) {
      res.json({success: false, error, data: null});
    }
  });

  api.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({email});
      if (utility.comparePassword(password, user.password)) {
        const signOptions = {
          issuer:  process.env.JWT_ISSUER,
          subject:  email,
          audience: process.env.JWT_AUDIENCE,
          // expiresIn:  60, // TODO: uncomment this (expires in minutes)
        };
        await UserModel.updateOne({_id: user._id}, {$set: {lastLoginOn: new Date()}});
        const payload = jwt.sign({email: user.email, _id: user._id, permissions: user.permissions}, process.env.JWT_SECRET, signOptions);
        res.json({success: true, error: null, data: {payload}});
      } else {
        res.json({success: false, error: 'Login failed, please check email and password', data: null});
      }
    } catch(error) {
      res.json({success: false, error, data: null});
    }
  });

  return api;
}