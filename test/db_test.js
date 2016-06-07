const expect = require('chai').expect;
const sinon = require('sinon');
const PassThrough = require('stream').PassThrough;
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const location = require(__dirname + '/../models/location');
const buildDb = require(__dirname + '/../lib/build_db');

describe('Database builder', () => {
  before(() => {
    this.sourceKeyBackup = process.env.APP_TOKEN;
    this.googleKeyBackup = process.env.GOOGLE_API_KEY;
    this.mongoUriBackup = process.env.MONGODB_URI;
    this.APP_TOKEN = 'sourceapikey';
    this.GOOGLE_API_KEY = 'googleapikey';
    this.MONGODB_URI = process.env.MONGODB_URI = 'mongodb://localhost/next_meal_test';
    mongoose.connect(this.MONGODB_URI);
  });

  after((done) => {
    process.env.APP_TOKEN = this.sourceKeyBackup;
    process.env.GOOGLE_API_KEY = this.googleKeyBackup;
    process.env.MONGODB_URI = this.mongoUriBackup;
    mongoose.connection.db.dropDatabase(() => {
      mongoose.disconnect(() => {
        done();
      });
    });
  });

  describe('getSourceData function', () => {
    var request;

    beforeEach(() => {
      request = sinon.stub(https, 'get');
    });

    afterEach(() => {
      https.get.restore();
    });

    it('should return a promise', () => {
      expect(buildDb.getSourceData()).to.be.an.instanceof(Promise);
    });

    it('should get JSON source data and parse into an array of objects', (done) => {
      var expected = fs.readFileSync(__dirname + '/data/src_data.json');
      var req = new PassThrough();
      var res = new PassThrough();

      res.write(expected);
      res.end();
      request.callsArgWithAsync(1, res).returns(req);
      buildDb.getSourceData('sourceurl', this.APP_TOKEN)
        .then((srcData) => {
          expect(srcData).to.be.an.instanceof(Array);
          expect(typeof srcData[0]).to.eql('object');
          expect(srcData.length).to.eql(77);
          done();
        })
        .catch(done);
    });

    it('should reject on a source API error', (done) => {
      var expected = { error: 'error', message: 'Test error message' };
      var req = new PassThrough();
      var res = new PassThrough();

      res.write(JSON.stringify(expected));
      res.end();
      request.callsArgWithAsync(1, res).returns(req);
      buildDb.getSourceData('sourceurl', this.APP_TOKEN)
        .then(null, (err) => {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.eql('Test error message');
          done();
        })
        .catch(done);
    });

    it('should reject on a GET request error', (done) => {
      var req = new PassThrough();

      request.returns(req);
      buildDb.getSourceData('sourceurl', this.APP_TOKEN)
        .then(null, (err) => {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.eql('Could not retrieve source data!');
          done();
        })
        .catch(done);
      req.emit('error', new Error('Test error message'));
    });
  });

  describe('dropCollection function', () => {
    var collection;
    var numDocs;
    var collectionDropped = false;

    before((done) => {
      var srcData = JSON.parse(fs.readFileSync(__dirname + '/data/src_data.json'));

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

                if (!collections) collectionDropped = true;

                done();
              });
            });
          });
      });
    });

    it('should return a promise', () => {
      expect(buildDb.dropCollection()).to.be.an.instanceof(Promise);
    });

    it('should drop an existing "locations" collection', () => {
      expect(collection).to.eql('locations');
      expect(numDocs).to.eql(77);
      expect(collectionDropped).to.eql(true);
    });
  });

  describe('getGeoData function', () => {
    var request;
    var srcDataArr = [
      { location: 'Test location one' },
      { location: 'Test location two' },
      { location: 'Test location three' }
    ];

    beforeEach(() => {
      request = sinon.stub(https, 'get');
    });

    afterEach(() => {
      https.get.restore();
    });

    it('should return a promise', () => {
      expect(buildDb.getGeoData()).to.be.an.instanceof(Promise);
    });

    it('should return an object containing source data and geodata arrays', (done) => {
      var req = [];
      var res = [];
      var expected = [
        { geoData: 'Test geodata one' },
        { geoData: 'Test geodata two' },
        { geoData: 'Test geodata three' }
      ];

      for (var i = 0; i < expected.length; i++) {
        req.push(new PassThrough());
        res.push(new PassThrough());
        res[i].write(JSON.stringify(expected[i]));
        res[i].end();
      }

      request.onFirstCall().callsArgWithAsync(1, res[0]).returns(req[0]);
      request.onSecondCall().callsArgWith(1, res[1]).returns(req[1]);
      request.onThirdCall().callsArgWith(1, res[2]).returns(req[2]);

      buildDb.getGeoData('googleurl', this.GOOGLE_API_KEY, srcDataArr)
        .then((dataObj) => {
          expect(dataObj.srcData).to.be.an.instanceof(Array);
          expect(dataObj.geoData).to.be.an.instanceof(Array);
          expect(dataObj.srcData.length).to.eql(3);
          expect(dataObj.geoData.length).to.eql(3);
          expect(dataObj.srcData[0].location).to.eql('Test location one');
          expect(dataObj.geoData[0].geoData).to.eql('Test geodata one');
          expect(dataObj.srcData[1].location).to.eql('Test location two');
          expect(dataObj.geoData[1].geoData).to.eql('Test geodata two');
          expect(dataObj.srcData[2].location).to.eql('Test location three');
          expect(dataObj.geoData[2].geoData).to.eql('Test geodata three');
          done();
        })
        .catch(done);
    });

    it('should reject on a Google API error', (done) => {
      var expected = { error_message: 'Test error message' };
      var req = new PassThrough();
      var res = new PassThrough();

      res.write(JSON.stringify(expected));
      res.end();
      request.callsArgWithAsync(1, res).returns(req);
      buildDb.getGeoData('googleurl', this.GOOGLE_API_KEY, srcDataArr)
        .then(null, (err) => {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.eql('Test error message');
          done();
        })
        .catch(done);
    });

    it('should reject on a GET request error', (done) => {
      var req = new PassThrough();

      request.returns(req);
      buildDb.getGeoData('googleurl', this.GOOGLE_API_KEY, srcDataArr)
        .then(null, (err) => {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.eql('Could not retrieve geo data!');
          done();
        })
        .catch(done);
      setTimeout(() => {
        req.emit('error', new Error('Test message'));
      }, 100);
    });
  });

  describe('setZipCode function', () => {
    var zipData;
    var dataObj = {
      srcData: [
        { location: '1062 Delaware Street, Denver, CO' },
        { location: '1234 Doesnt Exist Street, Nowheresville' },
        { location: '2901 3rd Ave, Suite 300, Seattle, WA' }
      ],
      geoData: ''
    };

    before(() => {
      dataObj.geoData = JSON.parse(fs.readFileSync(__dirname + '/data/geo_data.json'));
      zipData = buildDb.setZipCode(dataObj);
    });

    it('should add a zip code to each document with a valid address', () => {
      expect(zipData[0].zip_code).to.eql('80204');
      expect(zipData[2].zip_code).to.eql('98121');
    });

    it('should not add a zip code to a document with an invalid address', () => {
      expect(dataObj.geoData[1].status).to.eql('ZERO_RESULTS');
      expect(zipData[1]).to.not.haveOwnProperty('zip_code');
    });
  });
});
