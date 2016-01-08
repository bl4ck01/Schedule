const request = require('supertest');
const express = require('express');

const params = require('../config/config');

// Basic unit test, use as example in your project
describe('server', () => {
  it('should load home page', (done) => {
    request('http://localhost:' + params.baseAddress)
      .get('/')
      .expect(301) // piping redirection functionality of server creates 301 request instead of 200
      .end((err, res) => {
        if (err) throw err;
        done();
      });

    request('https://localhost:' + params.baseAddress)
      .get('/')
      .expect(304) // piping functionality of server creates 301 request instead of 200
      .end((err, res) => {
        if (err) throw err;
        done();
      });
  });
});
