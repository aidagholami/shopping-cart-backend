const dotenv = require('dotenv');

dotenv.config();

module.exports = function() {
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost/test'
}
