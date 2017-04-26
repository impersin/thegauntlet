const knex = require('../index.js');

module.exports = knex.schema.createTableIfNotExists('downvotes', (vote) => {
  vote.increments();
  vote.string('user_id');
  vote.string('challenge_id');
  vote.integer('vote');
}).then(() => {
  console.log('downvotes table created');
});
