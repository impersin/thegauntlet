var mysql = require('mysql');
var request = require('request');
var expect = require('chai').expect;
var db = require('../server/db/index.js');

describe('Challenge server', function() {

  it('Should sign a user up to DB', function (done) {
    db.select().from('users').where({username: 'test'}).del().then(() => {
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8000/api/signup',
        json: {
          firstname: 'test',
          lastname: 'test',
          username: 'test',
          email: 'test@test',
          password: 'test' 
        }
      }, function () {
        db.select().from('users').where({username: 'test'}).then(userData => {
          expect(userData.length).to.equal(1);
          expect(userData[0].username).to.equal('test');
          done();
        });
      });
    });
  });


  it('Should insert challenge to the DB', function(done) {
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:8000/api/login',
      json: {
        username: 'test',
        password: 'test' 
      }
    }, function () {
      db.select().from('challenges').where({username: 'test'}).del().then(() => {
        request({
          method: 'POST',
          uri: 'http://127.0.0.1:8000/api/challenge',
          json: {
            title: 'This is a challenge',
            description: 'Try and best me',
            category: 'Charity',
            filename: 'someFilename.jpg',
            created_at: new Date().getTime(),
            username: 'test'  
          }
        }, function () {
          db.select().from('challenges').where({username: 'test'}).then(challenge => {
            expect(challenge.length).to.equal(1);
            expect(challenge[0].title).to.equal('This is a challenge');
            db.select().from('sessions').del().then(() => {
              done();
            });
          });
        });
      });
    });
  });




});