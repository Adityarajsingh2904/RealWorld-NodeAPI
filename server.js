const mongoose = require('mongoose');
const app = require('./config/app');
const config = require('./config');

const isProduction = process.env.NODE_ENV === 'production';

mongoose.connect(
  config.mongoURI ||
    'mongodb://root:example@localhost:27017/conduit?authSource=admin'
);
if (!isProduction) {
  mongoose.set('debug', true);
}

require('./models/User');
require('./models/Article');
require('./models/Comment');
require('./config/passport');

const server = app.listen(process.env.PORT || 3000, function () {});

module.exports = server;
