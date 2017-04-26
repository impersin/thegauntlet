const mysql = require('mysql');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.HOST || 'localhost',
    user: process.env.USERNAME || 'root',
    password: process.env.PASSWORD || '',
    database: process.env.DATABASE || 'thegauntlet'
  },
  useNullAsDefault: true
});

module.exports = knex;