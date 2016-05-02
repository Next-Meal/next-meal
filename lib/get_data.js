
const es = require('event-stream');
const JSONStream = require('JSONStream');
const location = require(__dirname + '/../models/location');
const https = require('https');
const mongoose = require('mongoose');

var dataPath = 'https://data.seattle.gov/resource/47rs-c243.json';

module.exports = exports = function() {
  mongoose.connection.db.dropCollection('locations', (err, result) => {
    if (err) console.log('error in dropping');

    https.get(dataPath, (data) => {
      console.log('status code: ' + data.statusCode);
      console.log('headers: ' + data.headers);

      data
        .pipe(JSONStream.parse('*'))
        .pipe(es.map(function (doc, next) {
          location.collection.insert(doc, next);
      }));
    });
  });
};
