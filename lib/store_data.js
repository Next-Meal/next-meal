/* eslint-disable camelcase */
const https = require('https');
const mongoose = require('mongoose');
const location = require(__dirname + '/../models/location');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const APP_TOKEN = process.env.APP_TOKEN;

module.exports = exports = function() {
  var sourceData;
  var docArr = [];
  var docsPushed = 0;

  function getSourceData() {
    var path = 'https://data.seattle.gov/resource/47rs-c243.json';
    var fullPath = APP_TOKEN ? path + '?$$app_token=' + APP_TOKEN : path;

    https.get(fullPath, (data) => {
      var sourceBufs = [];

      process.stdout.write('Source data status: ' + data.statusCode + '\n');

      data.on('data', (chunk) => {
        sourceBufs.push(chunk);
      });

      data.on('end', () => {
        sourceData = JSON.parse(Buffer.concat(sourceBufs).toString());

        if (sourceData.error) return errorHandler(sourceData.message);

        checkDb();
      });

    }).on('error', (e) => {
      errorHandler(e);
    });
  }

  function checkDb() {
    mongoose.connection.db.listCollections({ name: 'locations' })
      .next((err, colls) => {
        if (err) return errorHandler(err);

        if (colls) {
          return mongoose.connection.db.dropCollection('locations', (err) => {
            if (err) return errorHandler(err);

            getGeoData();
          });
        }

        getGeoData();
      });
  }

  function getGeoData() {
    var googlePath = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    var intervalCounter = 0;

    var geoInterval = setInterval(() => {
      var doc;

      if (intervalCounter === sourceData.length) {
        return clearInterval(geoInterval);
      }

      doc = sourceData[intervalCounter];
      intervalCounter++;

      https.get(googlePath + doc.location + '&key=' + GOOGLE_API_KEY, (data) => {
        var geoBufs = [];

        data.on('data', (chunk) => {
          geoBufs.push(chunk);
        });

        data.on('end', () => {
          var geoData = JSON.parse(Buffer.concat(geoBufs).toString());

          setZipCode(doc, geoData);
        });

      }).on('error', (e) => {
        errorHandler(e);
      });

    }, 100);
  }

  function setZipCode(doc, geoData) {
    var addressComps;

    if (geoData.status === 'OK') {
      addressComps = geoData.results[0].address_components;

      for (var i = addressComps.length - 1; i >= 0; i--) {
        if (addressComps[i].types[0] === 'postal_code') {
          doc.zip_code = addressComps[i].long_name;
        }
      }
    } else {
      process.stdout.write('Geocode Status: ' + geoData.status + '\n');
      process.stdout.write('Location: ' + doc.location + '\n');
    }

    saveDocs(doc);
  }

  function saveDocs(doc) {
    docArr.push(doc);
    docsPushed++;

    if (docsPushed === sourceData.length) {
      location.insertMany(docArr, (err) => {
        if (err) return errorHandler(err);

        mongoose.disconnect();
        process.stdout.write('Database built!\n');
      });
    }
  }

  function errorHandler(err) {
    process.stderr.write(err + '\n');
    mongoose.disconnect();
  }

  getSourceData();
};
