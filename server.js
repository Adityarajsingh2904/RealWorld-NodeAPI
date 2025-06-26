const mongoose = require('mongoose');
const app = require('./config/app');

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://localhost/conduit');
  mongoose.set('debug', true);
}

require('./models/User');
require('./models/Article');
require('./models/Comment');
require('./config/passport');

const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port ' + server.address().port);
});

module.exports = server;
