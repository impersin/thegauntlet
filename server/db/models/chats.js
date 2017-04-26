const knex = require('../index.js');

module.exports = knex.schema.createTableIfNotExists('chats', (chat) => {
  chat.increments();
  chat.string('fromUsername');
  chat.string('toUsername');
  chat.string('profilepic');
  chat.boolean('new');
}).then(function() {
  console.log('chat table created');
});

