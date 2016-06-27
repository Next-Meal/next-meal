const expect = require('chai').expect;
const Organization = require(__dirname + '/../../../models/organization');
const mongoose = require('mongoose');
const server = require(__dirname + '/../../../_server');

describe('random organization find hash', () => {
  before((done) => {
    this.portBackup = process.env.PORT;
    this.mongoUriBackup = process.env.MONGODB_URI;
    this.PORT = process.env.PORT = 5000;
    this.MONGODB_URI = process.env.MONGODB_URI = 'mongodb://localhost/next_meal_test';
    this.server = server(this.PORT, this.MONGODB_URI, () => {
      var newOrganization = new Organization({ organizationName: 'test', password: 'test' });

      newOrganization.save((err, data) => {
        if (err) throw err;

        this.organization = data;
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

  it('should create a random hash', (done) => {
    this.organization.generateFindHash((err, hash) => {
      expect(err).to.eql(null);
      expect(hash.length).to.not.eql(0);
      expect(hash).to.eql(this.organization.findHash);
      done();
    });
  });
});
