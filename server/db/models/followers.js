const knex = require('../index.js');

module.exports = knex.schema.createTableIfNotExists('followers', (follower) => {
  follower.increments();
  follower.string('user_id');
  follower.string('leader_id');
}).then(() => {
  console.log('followers table created');
});
