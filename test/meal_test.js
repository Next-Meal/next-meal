
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const mongoose = require('mongoose');
const server = require(__dirname + '/../_server');

var port = process.env.PORT = 5000;

describe('meals router', () => {
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

  it('should allow a user to /GET meal information', (done) => {
    request('localhost:' + port)
    .get('/api/meals')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
    });
  });
});
