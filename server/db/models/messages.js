const knex = require('../index.js');

module.exports = knex.schema.createTableIfNotExists('messages', (message) => {
  message.increments('message_id');
  message.string('message');
  message.string('from_Username');
  message.string('to_Username');
  message.string('created_at');
  message.boolean('read');
  message.integer('chat_id');
}).then(() => {
  console.log('messages table created');
});
