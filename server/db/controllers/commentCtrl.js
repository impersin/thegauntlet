const comments = require('../models/comments.js');
const db = require('../index.js');
const messages = require('../models/messages.js');

module.exports = {
  addOne: (req, res) => {
    let comment = req.body;
    db.select('scott').from('users').where({username: req.session.displayName}).then(userData => {
      comment.user_id = userData[0].scott;
      db('comments').insert(comment).then(() => {
        db.select().from('comments').then(data => {
          res.json(data.slice(data.length - 1));
        });
      });
    });
  },

  getAll: (req, res) => {
    if (req.query.challenge_id) {
      db.select('comments.comment', 'comments.username', 'comments.created_at', 'comments.challenge_id', 'comments.read', 'comments.id')
      .from('comments')
      .innerJoin('challenges', 'challenges.id', 'comments.challenge_id').where('comments.challenge_id', '=', req.query.challenge_id).then(data => {
        res.json(data);
      });
    } else {
      db.select().from('challenges').where({user_id: req.query.user_id}).andWhere({parent_id: null}).then(challenges => {
        var yourChallengeIds = challenges.map(challenge => {
          return challenge.id;
        });

        db.select().from('comments').whereIn('challenge_id', yourChallengeIds).then(data => {
          res.json(data);
        });
      });
    }
  },

  read: (req, res) => {
    let id = req.params.id;
    console.log('comment id', id)
    db.from('comments').where({id: id}).update({read: 1}).then(() => {
      db.select().from('comments').where({id: id}).then((data) => {
        console.log('comment update data', data)
        res.json(data);
      });
    });
  },

  updateOne: (req, res) => {
    let comment = req.body.comment;
    let id = req.params.id
    console.log('comment', comment);
    console.log('id', id)
    db.from('comments').where({id: id}).update({comment: comment}).then(() => {
      db.select().from('comments').where({id: id}).then((data) => {
        console.log('comment update data', data)
        res.json(data);
      });
    });
  },

  deleteOne: (req, res) => {
    let id = req.body.id;
    let challenge_id = req.params.id;

    db.from('comments').where({id: id}).del().then(() => {
       db.select('comments.comment', 'comments.username', 'comments.created_at', 'comments.challenge_id', 'comments.read', 'comments.id')
      .from('comments')
      .innerJoin('challenges', 'challenges.id', 'comments.challenge_id').where('comments.challenge_id', '=', challenge_id).then(data => {
        res.json(data);
      });
    });
  }
};
