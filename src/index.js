const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const guard = require('express-jwt-permissions')()
const port = process.env.PORT || 3000;
const dotenv = require('dotenv').config();

const api = require('./api');
const crud = require('./api/crud');
const auth = require('./api/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(jwt({ secret: process.env.JWT_SECRET}).unless({path: [/auth/i]}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  next();
});

(async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URL);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      app.use('/', api());
      app.use('/auth', auth());
      app.use('/api/crud', crud('User', db));
      // app.use('/secret-route-example', guard.check('secretRole'), secretRoutes(db));
    });
  } catch (error) {
    console.log(`Failed to start server on port ${port}`)
  }
});