/* eslint-disable camelcase */
const https = require('https');
const mongoose = require('mongoose');
const location = require(__dirname + '/../models/location');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

var dataPath = 'https://data.seattle.gov/resource/47rs-c243.json';
var googlePath = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

module.exports = exports = function() {
  function getData() {
    https.get(dataPath, (data) => {
      var sourceBufs = [];

      process.stdout.write('Source data status: ' + data.statusCode + '\n');

      data.on('data', (chunk) => {
        sourceBufs.push(chunk);
      });

      data.on('end', () => {
        var docArr = [];
        var intervalCounter = 0;
        var collsPushed = 0;
        var sourceData = JSON.parse(Buffer.concat(sourceBufs).toString());

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
              var addressComps;
              var geoData = JSON.parse(Buffer.concat(geoBufs).toString());

              if (geoData.status === 'OK') {
                addressComps = geoData.results[0].address_components;

                for (var i = addressComps.length - 1; i >= 0; i--) {
                  if (addressComps[i].types[0] === 'postal_code') {
                    doc.zip_code = addressComps[i].long_name;
                  }
                }
              } else {
                process.stdout.write('Error: ' + geoData.status + '\n');
                process.stdout.write('Location: ' + doc.location + '\n');
              }
              docArr.push(doc);
              collsPushed++;

              if (collsPushed === sourceData.length) {
                location.insertMany(docArr, (err) => {
                  if (err) return process.stderr.write('Could not save documents to database!');

                  mongoose.disconnect();
                  process.stdout.write('Database built!\n');
                });
              }
            });
          });
        }, 100);
      });
    });
  }

  mongoose.connection.db.listCollections({ name: 'locations' })
    .next((err, data) => {
      if (err) return process.stderr.write(err + '\n');

      if (data) {
        return mongoose.connection.db.dropCollection('locations', (err) => {
          if (err) return process.stderr.write(err + '\n');

          getData();
        });
      }

      getData();
    });
};
