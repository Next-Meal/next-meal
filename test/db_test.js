
const expect = require('chai').expect;
const fs = require('fs');
const mongoose = require('mongoose');
const location = require(__dirname + '/../models/location');
const buildDb = require(__dirname + '/../lib/build_db');

describe('Database builder', () => {
  before((done) => {
    this.mongoUriBackup = process.env.MONGODB_URI;
    this.MONGODB_URI = process.env.MONGODB_URI = 'mongodb://localhost/next_meal_test';
    mongoose.connection.on('open', () => {
      var testDataArr = [
        { location: '1062 Delaware Street, Denver, CO' },
        { location: '1234 Doesnt Exist Street, Nowheresville' },
        { location: '2901 3rd Ave, Suite 300, Seattle, WA' },
        { location: 'One Amgen Center Drive, Thousand Oaks, CA' },
        { location: '401 Terry Ave N, Seattle, WA' }
      ];

      buildDb.getGeoData(testDataArr).then((data) => {
        this.testDataObj = data;
        done();
      });
    });
    mongoose.connect(this.MONGODB_URI);
  });

  after((done) => {
    process.env.MONGODB_URI = this.mongoUriBackup;
    mongoose.connection.db.dropDatabase(() => {
      mongoose.disconnect(() => {
        done();
      });
    });
  });

  describe('getSourceData function', () => {
    var srcData;

    before((done) => {
      buildDb.getSourceData().then((srcDataArr) => {
        srcData = srcDataArr;
        done();
      });
    });

    it('should get JSON source data and parse into an array of objects', () => {
      expect(Array.isArray(srcData)).to.eql(true);
      expect(typeof srcData[0]).to.eql('object');
      expect(srcData.length).to.be.above(0);
    });
  });

  describe('dropCollection function', () => {
    var collection;
    var numDocs;
    var collectionDropped = false;

    before((done) => {
      var srcData = JSON.parse(fs.readFileSync(__dirname + '/data/test_data.json'));

      location.insertMany(srcData, (err, data) => {
        if (err) throw err;

        numDocs = data.length;
        mongoose.connection.db.listCollections({ name: 'locations' })
          .next((err, collections) => {
            if (err) throw err;

            collection = collections.name;
            buildDb.dropCollection().then(() => {
              mongoose.connection.db.listCollections({ name: 'locations' })
              .next((err, collections) => {
                if (err) throw err;

                if (!collections) {
                  collectionDropped = true;
                }

                done();
              });
            });
          });
      });
    });

    it('should drop an existing "locations" collection', () => {
      expect(collection).to.eql('locations');
      expect(numDocs).to.eql(77);
      expect(collectionDropped).to.eql(true);
    });
  });

  describe('getGeoData function', () => {
    var geoDataPass = true;

    before(() => {
      for (var i = 0; i < this.testDataObj.geoData.length; i++) {
        if (!this.testDataObj.geoData[i]) {
          geoDataPass = false;
        }
      }
    });

    it('should return an object containing source data and geodata arrays', () => {
      expect(Array.isArray(this.testDataObj.srcData)).to.eql(true);
      expect(Array.isArray(this.testDataObj.geoData)).to.eql(true);
      expect(this.testDataObj.srcData.length).to.eql(5);
      expect(this.testDataObj.geoData.length).to.eql(5);
      expect(geoDataPass).to.eql(true);
      expect(this.testDataObj.geoData[2].results[0].formatted_address).to.eql(
        '2901 3rd Ave #300, Seattle, WA 98121, USA'
      );
    });
  });

  describe('setZipCode function', () => {
    var modSrcData;

    before(() => {
      modSrcData = buildDb.setZipCode(this.testDataObj);
    });

    it('should add a zip code to each document with a valid address', () => {
      expect(modSrcData[0].zip_code).to.eql('80204');
      expect(modSrcData[2].zip_code).to.eql('98121');
      expect(modSrcData[3].zip_code).to.eql('91320');
      expect(modSrcData[4].zip_code).to.eql('98109');
    });

    it('should not add a zip code to a document with an invalid address', () => {
      expect(this.testDataObj.geoData[1].status).to.eql('ZERO_RESULTS');
      expect(modSrcData[1]).to.not.haveOwnProperty('zip_code');
    });
  });
});
