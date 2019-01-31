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
      issuer:  'RedshiftAI',
      audience:  'https://redshift.ai',
    };
    return jwt.verify(token, process.env.JWT_SECRET, verifyOptions);
  },
}