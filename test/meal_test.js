
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const mongoose = require('mongoose');
const server = require(__dirname + '/../_server');

describe('meals router', () => {
  before((done) => {
    this.portBackup = process.env.PORT;
    this.mongoUriBackup = process.env.MONGODB_URI;
    this.PORT = process.env.PORT = 5000;
    this.MONGODB_URI = process.env.MONGODB_URI = 'mongodb://localhost/next_meal_test';
    this.server = server(this.PORT, this.MONGODB_URI, () => {
      setTimeout(done, 1000);
    });
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

  it('should allow a user to GET meal information', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(Array.isArray(res.body)).to.eql(true);
      expect(res.body.length).to.be.above(0);
      done();
    });
  });

  it('should filter breakfast meals', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals/breakfast')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].meal_served).to.eql('Breakfast');
      done();
    });
  });

  it('should filter lunch meals', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals/lunch')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].meal_served).to.eql('Lunch');
      done();
    });
  });

  it('should filter dinner meals', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals/dinner')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].meal_served).to.eql('Dinner');
      done();
    });
  });
});
