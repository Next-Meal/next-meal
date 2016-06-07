
const chai = require('chai');
const chaiHttp = require('chai-http');
const dirtyChai = require('dirty-chai');
chai.use(chaiHttp);
chai.use(dirtyChai);
const expect = chai.expect;
const request = chai.request;
const mongoose = require('mongoose');
const server = require(__dirname + '/../../../_server');

describe('server', () => {
  before((done) => {
    this.portBackup = process.env.PORT;
    this.mongoUriBackup = process.env.MONGODB_URI;
    this.PORT = process.env.PORT = 5000;
    this.MONGODB_URI = process.env.MONGODB_URI = 'mongodb://localhost/next_meal_test';
    this.server = server(this.PORT, this.MONGODB_URI, done);
  });

  after((done) => {
    process.env.PORT = this.portBackup;
    process.env.MONGODB_URI = this.mongoUriBackup;
    mongoose.connection.db.dropDatabase(() => {
      mongoose.disconnect(() => {
        this.server.close(done);
      });
    });
  });

  it('should send index on a GET request to root', (done) => {
    request('localhost:' + this.PORT)
    .get('/')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.text).to.contain('<!DOCTYPE html>');
      done();
    });
  });
});
