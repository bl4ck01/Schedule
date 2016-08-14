const request = require('supertest');

const subject = require('../app');

// Basic unit test, use as example in your project
describe('server', () => {
  it('should load home page', (done) => {
    request(subject)
      .get('/cal')
      .expect(200, done);
  });
});
