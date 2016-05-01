
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const mongoose = require('mongoose');
const server = require(__dirname + '/../_server');

var port = process.env.PORT = 5000;

describe('server', () => {
  before((done) => {
    this.server = server(port, 'mongodb://localhost/next_meal_test_db', done);
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.disconnect(() => {
        this.server.close(done);
      });
    });
  });

  it('should GET to localhost:5000', (done) => {
    request('localhost:5000')
    .get('/')
    .end((err, res) => {
      expect(err).to.eql(err);
      expect(res.status).to.eql(404);
      done();
    });
  });
});
