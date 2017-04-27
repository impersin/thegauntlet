const mysql = require('mysql');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'thegauntlet'
  },
  useNullAsDefault: true
});

module.exports = knex;