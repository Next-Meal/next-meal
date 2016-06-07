const expect = require('chai').expect;
const Organization = require(__dirname + '/../models/organization');
const mongoose = require('mongoose');

describe('random organization find hash', function() {
  before(function(done) {
    mongoose.connect('mongodb://localhost/organization_hash_test');
    var newOrganization = new Organization({ organizationName: 'test', password: 'test' });
    newOrganization.save((err, data) => {
      if (err) throw err;
      this.organization = data;
      done();
    });
  });
  after(function(done) {
    mongoose.connection.db.dropDatabase(done);
  });
  it('should create a random hash', function(done) {
    this.organization.generateFindHash((err, hash) => {
      expect(err).to.eql(null);
      expect(hash.length).to.not.eql(0);
      expect(hash).to.eql(this.organization.findHash);
      done();
    });
  });
});
