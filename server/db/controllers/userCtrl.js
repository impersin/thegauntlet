const app = require('../../server.js');
const users = require('../models/users.js');
const db = require('../index.js');
const bcrypt = require('promised-bcrypt');

module.exports = {
  signup: function(req, res) {
    let user = req.body;
    let username = user.username;
    let password = user.password;
    let firstname = user.firstname;
    let lastname = user.lastname;
    let email = user.email;
    db.select().from('users').where({username: username})
      .then(rows =>{
        if (rows.length) {
          res.send(false);
        } else {
          bcrypt.hash(password)
            .then(hash => {
              db('users').insert({
                firstname: firstname,
                lastname: lastname,
                email: email,
                username: username,
                password: hash,
                followers: 0,
                upvotes: 0,
              })
                .then(rows => {
                  req.session.displayName = username;
                  req.session.save(() => {
                    db.select('users.scott', 'users.firstname', 'users.lastname', 'users.email', 'users.profilepic', 'users.username', 'users.followers', 'users.upvotes').from('users').where('users.username', '=', username)
                    .then(data => {
                      res.json(data[data.length - 1]);
                    });
                  });
                })
                .catch(function(err) {
                  console.error(err);
                });
            });
        }
      });
  },

  getUser: function(req, res) {
    let username = req.params.username || req.session.displayName;
    db.select('users.scott', 'users.firstname', 'users.lastname', 'users.email', 'users.profilepic', 'users.username', 'users.followers', 'users.upvotes').from('users').where('users.username', '=', username).then(data => {
      res.json(data);
    });
  },

  login: function(req, res) {
    let user = req.body;
    let username = user.username;
    let password = user.password;
    db.select().from('users').where('users.username', '=', username)
      .then(rows =>{
        if (rows.length) {
          bcrypt.compare(password, rows[0].password)
            .then(pass => {
              if (pass) {
                req.session.displayName = username;
                req.session.save(() => {
                  db.select('users.scott', 'users.firstname', 'users.lastname', 'users.email', 'users.profilepic', 'users.username', 'users.followers', 'users.upvotes').from('users').where('users.username', '=', username)
                    .then(data => {
                      res.json(data[data.length - 1]);
                    });
                });
              } else {
                res.send(false);
              }
            });
        } else {
          res.send(false);
        }
      });
  },

  logout: function(req, res) {
    let temp = req.session.displayName;
    req.session.destroy();
    res.send('Good bye  ' + temp);
  },

  getAllUsers: function(req, res) {
    let username = req.params.username || req.session.displayName;
    db.select( 'users.username', 'users.upvotes', 'users.scott').from('users').then(data => {
      data = data.sort((a, b)=> b.upvotes - a.upvotes);
      res.json(data);
    });
  },

  updateProfile: function(req, res) {
    let edits = req.body;
    db.select().from('users').where({scott: req.body.scott}).update(edits).then(() => {
      res.sendStatus(200);
    });
  },

  isUser: (req, res) => {
    let username = req.query;
    db.select().from('users').where(username).then(exist => {
      if (exist.length) {
        res.json(true);
      } else {
        res.json(false);
      }
    });
  }
};

