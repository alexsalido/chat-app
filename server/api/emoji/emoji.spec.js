'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/emojis', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/emojis')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
