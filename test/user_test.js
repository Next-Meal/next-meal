const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const mongoose = require('mongoose');
const server = require(__dirname + '/../_server');

describe('user router', () => {
  before((done) => {
    this.PORT = process.env.PORT;
    this.MONGODB_URI = 'mongodb://localhost/next_meal_test';
    this.server = server(this.PORT, this.MONGODB_URI, done);
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.disconnect(() => {
        this.server.close(done);
      });
    });
  });
  it('should show instructions for signing up', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/signup')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.text).to.eql('Please Text 206-429-6617 to sign-up for Next-Meal');
      done();
    });
  });
});
