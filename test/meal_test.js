
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const fs = require('fs');
const mongoose = require('mongoose');
const location = require(__dirname + '/../models/location');
const server = require(__dirname + '/../_server');

describe('meals router', () => {
  before((done) => {
    var testData = JSON.parse(fs.readFileSync(__dirname + '/data/test_data.json'));

    this.portBackup = process.env.PORT;
    this.mongoUriBackup = process.env.MONGODB_URI;
    this.PORT = process.env.PORT = 5000;
    this.MONGODB_URI = process.env.MONGODB_URI = 'mongodb://localhost/next_meal_test';
    this.server = server(this.PORT, this.MONGODB_URI, () => {
      location.insertMany(testData, (err) => {
        if (err) throw err;
        done();
      });
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

  it('should allow a user to GET all meal information', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(Array.isArray(res.body)).to.eql(true);
      expect(res.body.length).to.eql(77);
      done();
    });
  });

  it('should filter locations for breakfast', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals/breakfast')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].meal_served).to.eql('Breakfast');
      expect(res.body.length).to.eql(13);
      done();
    });
  });

  it('should filter locations for lunch', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals/lunch')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].meal_served).to.eql('Lunch');
      expect(res.body.length).to.eql(39);
      done();
    });
  });

  it('should filter locations for snacks', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals/snack')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].meal_served).to.eql('Snack');
      expect(res.body.length).to.eql(2);
      done();
    });
  });

  it('should filter locations for dinner', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals/dinner')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].meal_served).to.eql('Dinner');
      expect(res.body.length).to.eql(22);
      done();
    });
  });

  it('should filter locations that serve everyone', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals/everyone')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].people_served).to.match(/open to all/i);
      expect(res.body.length).to.eql(50);
      done();
    });
  });

  it('should filter locations that serve men', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals/men')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].people_served).to.match(/(^#.|[^o]|[^w]o)men/i);
      expect(res.body.length).to.eql(3);
      done();
    });
  });

  it('should filter locations that serve women', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals/women')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].people_served).to.match(/women/i);
      expect(res.body.length).to.eql(7);
      done();
    });
  });

  it('should filter locations that serve youth', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals/youth')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].people_served).to.match(/youth/i);
      expect(res.body.length).to.eql(10);
      done();
    });
  });

  it('should filter locations that serve children', (done) => {
    request('localhost:' + this.PORT)
    .get('/api/meals/children')
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body[0].people_served).to.match(/children/i);
      expect(res.body.length).to.eql(3);
      done();
    });
  });
});
