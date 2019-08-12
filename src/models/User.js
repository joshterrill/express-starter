const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  password: String,
  createdOn: Date,
  lastLoginOn: Date,
  permissions: Array,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;