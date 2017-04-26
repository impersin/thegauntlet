const knex = require('../index.js');

module.exports = knex.schema.createTableIfNotExists('favorites', (favorite) => {
  favorite.increments();
  favorite.string('user_id');
  favorite.string('challenge_id');
}).then(() => {
  console.log('favorites table created');
});


