
const es = require('event-stream');
const JSONStream = require('JSONStream');
const location = require(__dirname + '/../models/location');
const https = require('https');
const mongoose = require('mongoose');

var dataPath = 'https://data.seattle.gov/resource/47rs-c243.json';

module.exports = exports = function() {
  function getData() {
    https.get(dataPath, (data) => {
      process.stdout.write('Status: ' + data.statusCode + '\n');

      data
        .pipe(JSONStream.parse('*'))
        .pipe(es.map((doc, next) => {
          location.collection.insert(doc, next);
        }));
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
