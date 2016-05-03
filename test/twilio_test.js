/* eslint-disable camelcase */

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const mongoose = require('mongoose');
const server = require(__dirname + '/../_server');
const location = require(__dirname + '/../models/location');

describe('twilio router', () => {
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
  it('should send back locations of a certain meal', (done) => {
    var Body = 'Lunch';
    location.find({ meal_served: Body }, (err, data) => {
      if (err) console.log(err);
      var str = data;
      console.log(str[1]);
      expect(str[1].meal_served).to.eql('Lunch');
      done();
    });
  });
});
