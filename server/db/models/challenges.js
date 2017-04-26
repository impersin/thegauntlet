const knex = require('../index.js');

module.exports = knex.schema.createTableIfNotExists('challenges', (challenge) => {
  challenge.increments();
  challenge.string('title');
  challenge.string('description', 1000);
  challenge.string('filename');
  challenge.string('category');
  challenge.integer('views');
  challenge.integer('upvotes');
  challenge.string('created_at');
  challenge.integer('parent_id');
  challenge.string('username');
  challenge.boolean('read');
  challenge.integer('user_id').unsigned();//.references('id').inTable('users').onUpdate().onDelete();
}).then(function() {
  console.log('challenge table created');
});

