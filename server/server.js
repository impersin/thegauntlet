const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/routes.js');
const multiparty = require('connect-multiparty');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const app = express();

const multipartyMiddleware = multiparty();
// using session middleware
app.use(require('express-session')({
  key: process.env.SESSION || 'session',
  secret: process.env.SECRET || 'SUPER SECRET SECRET',
  store: new MySQLStore({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'thegauntlet'
  })
})
);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(multipartyMiddleware);
app.use('/api', routes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log('Gauntlet server listening on port:', port);
});