const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  encryptPassword: (password) => {
    return bcrypt.hashSync(password, 10);
  },
  comparePassword: (password, hash) => {
    return bcrypt.compareSync(password, hash);
  },
  verifyJWT: (token) => {
    const verifyOptions = {
      issuer:  process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    };
    return jwt.verify(token, process.env.JWT_SECRET, verifyOptions);
  },
  createSignObjects: (email) => {
    return signOptions = {
      issuer:  process.env.JWT_ISSUER,
      subject:  email,
      audience: process.env.JWT_AUDIENCE,
      expiresIn:  '8h',
    };
  },
}