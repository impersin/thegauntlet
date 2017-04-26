const chat = require('../models/chats.js');
const db = require('../index.js');

module.exports = {
  createChat: (req, res) => {
    console.log('chat req.body', req.body)
    let chat = req.body;
    let fromUsername = req.body.fromUsername;
    let toUsername = req.body.toUsername;
    db.select('users.profilepic').from('users').where('users.username', '=', toUsername).then(data => {
      chat.profilepic = data[0].profilepic || '';
      db('chats').insert(chat).then(() => {
        db.select().from('chats').then(chatRoom => {
          console.log(chatRoom, 'chatRoom')
          res.json(chatRoom.slice(chatRoom.length - 1));
        });
      });
    });
  },

  getChats: (req, res) => {
    let username = req.query.username;

    db.select().from('chats').where({fromUsername: username}).orWhere({toUsername: username}).then(data => {
      res.json(data);
    });
  },

  sendOne: (req, res) => {
    let message = req.body;
    let to_Username = req.params.to_Username;
    db('messages').where({to_Username: to_Username}).insert(message).then(() => {
      db.select().from('messages').where({to_Username: to_Username}).then(message => {
        console.log('message', message)
        res.json(message);
      });
    });
  },

  replyOne: (req, res) => {
    let message = req.body;
    let chat_id = req.params.id;

    db('messages').where({chat_id: chat_id}).insert(message).then(() => {
      db.select('messages.message_id', 'messages.created_at', 'messages.message', 'messages.to_Username', 'messages.chat_id', 'messages.read', 'messages.from_Username').from('messages').where({chat_id: chat_id}).then(message => {
        console.log('reply message', message.slice(message.length - 1))
        res.json(message.slice(message.length - 1));
      });
    });
  },

  getAll: (req, res) => {
    let to_Username = req.params.to_Username;
    db.select('messages.message_id', 'messages.message', 'messages.chat_id', 'messages.created_at', 'chats.profilepic', 'messages.read', 'chats.fromUsername', 'chats.toUsername').from('messages').where({to_Username: to_Username}).orWhere({from_Username: to_Username}).innerJoin('chats', 'chats.id', 'messages.chat_id').then(messages => {
       res.json(messages);
    });
  },

  getChatMessages: (req, res) => {
    let chat_id = req.params.id;
    db.select().from('messages').where({chat_id: chat_id}).then(messages => {
      res.json(messages);
    });
  },

  read: (req, res) => {
    let message_id = req.params.id;
    console.log('message id', message_id)
    db.from('messages').where({read: 0}).update({read: 1}).then(() => {
      db.select('messages.message_id', 'messages.message', 'messages.from_Username', 'messages.to_Username', 'users.username', 'messages.created_at', 'users.profilepic', 'messages.read').from('messages').where({message_id: message_id}).innerJoin('users', 'users.username', 'messages.from_Username').then(messages => {
        console.log('messages updated', messages);
        res.json(messages);
      });
    });
  },

  seenChat: (req, res) => {
    let chat_id = req.params.id;
     db.from('chats').where({id: chat_id}).update({new: 0}).then(() => {
      db.select('chats.fromUsername', 'chats.toUsername', 'chats.profilepic', 'chats.new', 'chats.id').from('chats').then(chat => {
        res.json(chat);
      });
    });
  },

  unseenChat: (req, res) => {
    let chat_id = req.params.id;
    db.from('chats').where({id: chat_id}).update({new: 1}).then(() => {
      db.select('chats.fromUsername', 'chats.toUsername', 'chats.profilepic', 'chats.new', 'chats.id').from('chats').then(chat => {
        res.json(chat);
      });
    });
  }
};
