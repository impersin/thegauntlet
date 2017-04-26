const knex = require('../index.js');

module.exports = knex.schema.createTableIfNotExists('users', (user) => {
  user.increments('scott');
  user.string('firstname');
  user.string('lastname');
  user.string('username');
  user.string('password');
  user.string('email');
  user.string('profilepic');
  user.integer('followers');
  user.integer('upvotes');
}).then(() => {
  console.log('user table created');
});

