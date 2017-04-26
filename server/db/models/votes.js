const knex = require('../index.js');

module.exports = knex.schema.createTableIfNotExists('votes', (vote) => {
  vote.increments();
  vote.string('user_id');
  vote.string('challenge_id');
  vote.integer('vote');
}).then(() => {
  console.log('votes table created');
});

