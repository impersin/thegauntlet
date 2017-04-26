const challenges = require('../models/challenges.js');
const favorites = require('../models/favorites');
const votes = require('../models/votes.js');
const downvotes = require('../models/downvotes.js');
const db = require('../index.js');
const s3 = require('./s3Ctrl.js');

module.exports = {
  addOne: (req, res) => {
    const challenge = req.body;
    console.log(req.session);
    db.select('scott')
    .from('users')
    .where({username: req.session.displayName || req.body.username})
    .then(userData => {
      challenge.user_id = userData[0].scott;
      challenge.upvotes = 0;
      challenge.views = 0;
      db('challenges').insert(challenge).then(data => {
        db.select().from('challenges').innerJoin('users', 'challenges.user_id', 'users.scott').select('challenges.id', 'challenges.title', 'challenges.description', 'challenges.filename', 'challenges.category', 'challenges.views', 'challenges.upvotes', 'challenges.parent_id', 'users.firstname', 'users.lastname', 'users.email', 'users.username', 'challenges.created_at', 'challenges.user_id').then(data => {
          res.json(data.slice(data.length - 1));
        });
      }).catch(err => {
        if (err) { console.error(err); }
      });
    });
  },

  addOneResponse: (req, res) => {
    const challenge = req.body;
    const challengeId = req.params.id;
    db.select('category')
      .from('challenges')
      .where('id', '=', challenge.parent_id)
      .then( category => {
        challenge.category = category[0].category;
      })
      .then(
        db.select('scott')
        .from('users')
        .where({username: req.session.displayName})
        .then(userData => {
          challenge.user_id = userData[0].scott;
          challenge.upvotes = 0;
          challenge.views = 0;
          db('challenges').insert(challenge).then(data => {
            db.select()
            .from('challenges')
            .innerJoin('users', 'challenges.user_id', 'users.scott')
            .select('challenges.id', 'challenges.title', 'challenges.description', 'challenges.filename', 'challenges.category', 'challenges.views', 'challenges.upvotes', 'challenges.parent_id', 'users.firstname', 'users.lastname', 'users.email', 'users.username', 'challenges.created_at', 'challenges.user_id')
            .then(data => {
              res.json(data.slice(data.length - 1));
            });
          }).catch(err => {
            if (err) { console.error(err); }
          });
        })
      );
  },

  s3: (req, res) => {
    // s3(req.files.video, res);
    res.json(req.files.video.originalFilename);
  },

  getAll: (req, res) => {
    db.select().from('challenges').where({parent_id: null}).innerJoin('users', 'challenges.user_id', 'users.scott').select('challenges.id', 'challenges.title', 'challenges.description', 'challenges.filename', 'challenges.category', 'challenges.views', 'challenges.upvotes', 'challenges.parent_id', 'users.firstname', 'users.lastname', 'users.email', 'users.username', 'challenges.created_at', 'challenges.user_id').then(data => {
      res.json(data);
    });
  },

  getEveryChallenge: (req, res) => {
    db.select().from('challenges').innerJoin('users', 'challenges.user_id', 'users.scott').select('challenges.id', 'challenges.title', 'challenges.description', 'challenges.filename', 'challenges.category', 'challenges.views', 'challenges.upvotes', 'challenges.parent_id', 'users.firstname', 'users.lastname', 'users.email', 'users.username', 'challenges.created_at', 'challenges.user_id').then(data => {
      res.json(data);
    });
  },

  getAllResponses: (req, res) => {
    let parent_id = req.query.parent_id;

    if (req.query.parent_id) {
      db.select().from('challenges').innerJoin('users', 'challenges.user_id', 'users.scott').select('challenges.id', 'challenges.title', 'challenges.description', 'challenges.filename', 'challenges.category', 'challenges.views', 'challenges.upvotes', 'challenges.parent_id', 'users.firstname', 'users.lastname', 'users.email', 'users.username', 'challenges.created_at', 'challenges.user_id', 'challenges.read').where('challenges.parent_id', '=', parent_id).then(data => {
        res.json(data);
      });
    } else {

      let user_id = req.query.user_id;
      console.log('user_id', typeof user_id)
      db.select().from('challenges').where({user_id: user_id}).then(challenges => {
        console.log('challenges', challenges)

        db.select().from('challenges').whereNot({parent_id: null}).then(data => {
          console.log('data', data)
          res.json(data);
        });
      });
    }
  },

  getSingleChallengeById: (req, res) => {
    console.log('SINGLE CHALLENGE ID', req.query.id);
    let challengeId = req.query.id;
    db.select().from('challenges').where('id', '=', challengeId)
      .then(challenge => {
        res.json(challenge);
      });
  },

  getOne: (req, res) => {
    db.select()
    .from('challenges')
    .where({id: req.params.id})
    .then(data =>{
      res.json(data);
    })
    .catch((err) => {
      if (err) { console.error(err); }
    });
  },

  updateOne: (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const id = req.params.id;
    db.from('challenges').where({id: id}).update({title: title, description: description}).then(() => {
      db.select().from('challenges').innerJoin('users', 'challenges.user_id', 'users.scott').select('challenges.id', 'challenges.title', 'challenges.description', 'challenges.filename', 'challenges.category', 'challenges.views', 'challenges.upvotes', 'challenges.parent_id', 'users.firstname', 'users.lastname', 'users.email', 'users.username', 'challenges.created_at', 'challenges.user_id').where('challenges.id', '=', id).then(data => {
        res.json(data);
      });
    });
  },

  deleteOne: (req, res) => {
    const id = req.params.id;
    db.from('challenges').where({id: id}).del().then(() => {
      db.select().from('challenges').where({parent_id: null}).innerJoin('users', 'challenges.user_id', 'users.scott').select('challenges.id', 'challenges.title', 'challenges.description', 'challenges.filename', 'challenges.category', 'challenges.views', 'challenges.upvotes', 'challenges.parent_id', 'users.firstname', 'users.lastname', 'users.email', 'users.username', 'challenges.created_at', 'challenges.user_id').then(data => {
        res.json(data);
      });
    });
  },

  deleteOneResponse: (req, res) => {
    const id = req.params.id;
    const parent_id = req.body.parent_id;
    const user_id = req.body.user_id;
    db.from('challenges').where({id: id}).del().then(() => {
      db.select().from('challenges').innerJoin('users', 'challenges.user_id', 'users.scott').select('challenges.id', 'challenges.title', 'challenges.description', 'challenges.filename', 'challenges.category', 'challenges.views', 'challenges.upvotes', 'challenges.parent_id', 'users.firstname', 'users.lastname', 'users.email', 'users.username', 'challenges.created_at', 'challenges.user_id').where('users.scott', '=', user_id).then(data => {
        res.json(data);
      });
    });
  },

  getUserChallenges: (req, res) => {
    let id = req.query.user_id;
    db.select().from('challenges').where({user_id: id}).innerJoin('users', 'challenges.user_id', 'users.scott').select('challenges.id', 'challenges.title', 'challenges.description', 'challenges.filename', 'challenges.category', 'challenges.views', 'challenges.upvotes', 'challenges.parent_id', 'users.firstname', 'users.lastname', 'users.email', 'users.username', 'challenges.created_at', 'challenges.user_id').where({parent_id: null}).then(data => {
      res.json(data);
    });
  },

  read: (req, res) => {
    let id = req.params.id;

    db.from('challenges').where({read: 0}).update({read: 1}).then(() => {
      db.select().from('challenges').innerJoin('users', 'challenges.user_id', 'users.scott').select('challenges.id', 'challenges.title', 'challenges.description', 'challenges.filename', 'challenges.category', 'challenges.views', 'challenges.upvotes', 'challenges.parent_id', 'users.firstname', 'users.lastname', 'users.email', 'users.username', 'challenges.created_at', 'challenges.user_id', 'challenges.read').where('challenges.id', '=', id).then(data => {
        res.json(data);
      });
    });
  },

  upvote: (req, res) => { //CHECK: Should fix upvote spam but needs to be tested
    let vote = req.body; //req.body should have challenge_id and vote = 1
    db.select().from('users').where({username: req.session.displayName}).then(userData => {
      db.select().from('votes').where({user_id: userData[0].scott}).andWhere({challenge_id: req.body.challenge_id}).then(exists => {
        vote.user_id = userData[0].scott;
        if (exists.length) {
          db.select().from('votes').where({id: exists[0].id}).del().then(() => {
            db.from('challenges').where({id: req.body.challenge_id}).decrement('upvotes', 1).then(() =>{
              db.select('challenges.user_id').from('challenges').where({id: req.body.challenge_id}).then(data => {
                db.select().from('users').where({scott: data[0].user_id}).decrement('upvotes', 1).then(() => {
                  res.sendStatus(201);
                });
              });
            });
          });
        } else {
          db.select().from('downvotes').where({user_id: userData[0].scott}).andWhere({challenge_id: req.body.challenge_id}).then(downVoted => {
            if (downVoted.length) {
              db.select().from('downvotes').where({id: downVoted[0].id}).del().then(()=>{
                db('votes').insert(vote).then( () => {
                  db.from('challenges').where({id: req.body.challenge_id}).increment('upvotes', 2).then(() => {
                    db.select('challenges.user_id').from('challenges').where({id: req.body.challenge_id}).then(data => {
                      db.select().from('users').where({scott: data[0].user_id}).increment('upvotes', 2).then(() => {
                        res.sendStatus(201);
                      });
                    });
                  });
                });
              });
            } else {
              db('votes').insert(vote).then( () => {
                db.from('challenges').where({id: req.body.challenge_id}).increment('upvotes', 1).then(() => {
                  db.select('challenges.user_id').from('challenges').where({id: req.body.challenge_id}).then(data => {
                    db.select().from('users').where({scott: data[0].user_id}).increment('upvotes', 1).then(() => {
                      res.sendStatus(201);
                    });
                  });
                });
              });
            }
          });
        }
      });
    });
  },

  downvotes: (req, res) => {
    let vote = req.body;
    db.select().from('users').where({username: req.session.displayName}).then(userData => {
      db.select().from('downvotes').where({user_id: userData[0].scott}).andWhere({challenge_id: req.body.challenge_id}).then(exists => {
        vote.user_id = userData[0].scott;
        if (exists.length) {
          db.select().from('downvotes').where({id: exists[0].id}).del().then(() => {
            db.select().from('downvotes').where({challenge_id: req.body.challenge_id}).then(() => {
              db.from('challenges').where({id: req.body.challenge_id}).increment('upvotes', 1).then( () => {
                db.select('challenges.user_id').from('challenges').where({id: req.body.challenge_id}).then(data => {
                  db.select().from('users').where({scott: data[0].user_id}).increment('upvotes', 1).then(() => {
                    res.sendStatus(201);
                  });
                });
              });
            });
          });
        } else {
          db.select().from('votes').where({user_id: userData[0].scott}).andWhere({challenge_id: req.body.challenge_id}).then(upVoted => {
            if (upVoted.length) {
              db.select().from('votes').where({id: upVoted[0].id}).del().then(() => {
                db('downvotes').insert(vote).then(() => {
                  db.select().from('challenges').where({id: req.body.challenge_id}).decrement('upvotes', 2).then(() => {
                    db.select('challenges.user_id').from('challenges').where({id: req.body.challenge_id}).then(data => {
                      db.select().from('users').where({scott: data[0].user_id}).decrement('upvotes', 2).then(() => {
                        res.sendStatus(201);
                      });
                    });
                  });
                });
              });
            } else {
              db('downvotes').insert(vote).then(() => {
                db.select().from('challenges').where({id: req.body.challenge_id}).decrement('upvotes', 1).then(() => {
                  db.select('challenges.user_id').from('challenges').where({id: req.body.challenge_id}).then(data => {
                    db.select().from('users').where({scott: data[0].user_id}).decrement('upvotes', 1).then(() => {
                      res.sendStatus(201);
                    });
                  });
                });
              });
            }
          });
        }
      });
    });
  },

  favorite: (req, res) => {
    let favorite = req.body;
    db.select().from('users').where({username: req.session.displayName})
      .then(userData => {
        db.select().from('favorites').where({user_id: userData[0].scott}).andWhere({challenge_id: favorite.challenge_id})
          .then( exists => {
            if (exists.length) {
              res.sendStatus(201);
            } else {
              favorite.user_id = userData[0].scott;
              db('favorites').insert(favorite).then(results=>{
                res.sendStatus(201);
              });
            }
          });
      });
  },

  unFavorite: (req, res) => {
    let favorite = req.body.challenge_id;
    db.del().from('favorites').where({challenge_id: favorite})
      .then(() => {
        res.sendStatus(201);
      });
  },

  getFavorites: (req, res) => {
    let username = req.query.username || req.session.displayName;
    db.select('scott').from('users').where({username: username})
    .then( userData => {
      db.select().from('favorites')
      .innerJoin('challenges', 'challenges.id', 'favorites.challenge_id')
      .where('favorites.user_id', '=', userData[0].scott)
      .then(favorites => {
        res.json(favorites);
      });
    });
  },

  viewed: (req, res) => {
    db.select('views').from('challenges').where({id: req.body.challenge_id}).then(challengeData => {
      db.select().from('challenges').where({id: req.body.challenge_id}).update({views: challengeData[0].views + 1}).then( () => {
      });
    });
  },

  challengeSearch: (req, res) => {
    let search = req.query.search;
    db.select().from('challenges')
    .innerJoin('users', 'challenges.user_id', 'users.scott').select('challenges.id', 'challenges.title', 'challenges.description', 'challenges.filename', 'challenges.category', 'challenges.views', 'challenges.upvotes', 'challenges.parent_id', 'users.firstname', 'users.lastname', 'users.email', 'users.username', 'challenges.created_at', 'challenges.user_id')
    .where('title', 'like', `%${search}%`)
    .orWhere('users.username', 'like', `%${search}%`)
    .then(data => {
      res.json(data);
    });
  },

  getUpvoted: (req, res) => {
    db.select().from('users').where({username: req.session.displayName}).then(userData => {
      db.select('votes.challenge_id').from('votes').where({user_id: userData[0].scott}).then(data => {
        data = data.map(obj => parseInt(obj.challenge_id));
        res.json(data);
      });
    });
  },

  getDownvoted: (req, res) => {
    db.select().from('users').where({username: req.session.displayName}).then(userData => {
      db.select('downvotes.challenge_id').from('downvotes').where({user_id: userData[0].scott}).then(data => {
        data = data.map(obj => parseInt(obj.challenge_id));
        res.json(data);
      });
    });
  }
};

