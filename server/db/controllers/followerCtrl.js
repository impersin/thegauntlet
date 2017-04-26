const comments = require('../models/followers.js');
const db = require('../index.js');

module.exports = {
  follow: (req, res) => {
    let follow = req.body; //req.body has leader_id
    db.select('scott').from('users').where({username: req.session.displayName}).then(userData =>{
      db.select().from('followers').where({user_id: userData[0].scott}).andWhere({leader_id: req.body.leader_id}).then((followerData) => {
        if (!followerData.length) {
          follow.user_id = userData[0].scott;
          db('followers').insert(follow).then(() => {
            db.select().from('followers').where({leader_id: req.body.leader_id}).then(leaderData => {
              db.select().from('users').where({scott: req.body.leader_id}).update({followers: leaderData.length}).then(() => {
                res.sendStatus(201);
              });
            });
          });
        } else {
          res.sendStatus(404);
        }
      });
    });
  },

  getNumberOfFollowers: (req, res) => {
    db.select('users.username', 'users.followers').from('users').where({scott: req.query.id}).then((data) => {
      res.json(data[0]);
    });
  },

  getLeaders: (req, res) => {
    db.select('scott').from('users').where({username: req.session.displayName}).then(userData => {
      db.select().from('followers').where({user_id: userData[0].scott}).then(leaders => {
        let leaderArray = leaders.map((leader) => {
          return leader.leader_id;
        });
        res.send(leaderArray);
      });
    });
  },

  unFollow: (req, res) => {
    db.select('scott').from('users').where({username: req.session.displayName}).then(userData => {
      db('followers').where({user_id: userData[0].scott}).andWhere({leader_id: req.body.leader_id}).del().then(() => {
        db.select().from('followers').where({leader_id: req.body.leader_id}).then(leaderData => {
          db.select().from('users').where({scott: req.body.leader_id}).update({followers: leaderData.length}).then(() => {
            res.sendStatus(201);
          });
        });
      });
    });
  },

  getListOfFollowers: (req, res) => {
    db.select('scott').from('users').where({username: req.query.username}).then(userData => {
      db.select('users.username').from('followers').innerJoin('users', 'followers.user_id', 'users.scott').where({leader_id: userData[0].scott}).then(data => {
        res.json(data);
      });
    });
  }

};