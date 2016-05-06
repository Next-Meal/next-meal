/* eslint-disable camelcase */
const https = require('https');
const mongoose = require('mongoose');
const location = require(__dirname + '/../models/location');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const APP_TOKEN = process.env.APP_TOKEN;

module.exports = exports = (function() {
  function getSourceData() {
    return new Promise((resolve, reject) => {
      var srcDataArr;
      var path = 'https://data.seattle.gov/resource/47rs-c243.json';
      var fullPath = APP_TOKEN ? path + '?$$app_token=' + APP_TOKEN : path;

      https.get(fullPath, (data) => {
        var sourceBufs = [];

        process.stdout.write('Source data status: ' + data.statusCode + '\n');

        data.on('data', (chunk) => {
          sourceBufs.push(chunk);
        });

        data.on('end', () => {
          srcDataArr = JSON.parse(Buffer.concat(sourceBufs).toString());

          if (srcDataArr.error) reject(srcDataArr.message);

          resolve(srcDataArr);
        });
      }).on('error', (e) => {
        reject(e);
      });
    });
  }

  function dropCollection(srcDataArr) {
    return new Promise((resolve, reject) => {
      mongoose.connection.db.listCollections({ name: 'locations' })
        .next((err, collections) => {
          if (err) reject(err);

          if (collections) {
            return mongoose.connection.db.dropCollection('locations', (err) => {
              if (err) reject(err);

              resolve(srcDataArr);
            });
          }
          resolve(srcDataArr);
        });
    });
  }

  function getGeoData(srcDataArr) {
    return new Promise((resolve, reject) => {
      var googlePath = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
      var intervalCounter = 0;
      var dataCounter = 0;
      var geoDataArr = [];
      var dataObj = {
        srcData: srcDataArr
      };
      var geoInterval = setInterval(() => {
        var doc;

        if (intervalCounter === srcDataArr.length) return clearInterval(geoInterval);

        doc = srcDataArr[intervalCounter];

        (function(intervalCounter) {
          https.get(googlePath + doc.location + '&key=' + GOOGLE_API_KEY, (data) => {
            var geoBufs = [];

            data.on('data', (chunk) => {
              geoBufs.push(chunk);
            });
            data.on('end', () => {
              var geoData = JSON.parse(Buffer.concat(geoBufs).toString());

              geoDataArr[intervalCounter] = geoData;
              dataCounter++;

              if (dataCounter === srcDataArr.length) {
                dataObj.geoData = geoDataArr;
                resolve(dataObj);
              }
            });
          }).on('error', (e) => {
            reject(e);
          });
        })(intervalCounter);

        intervalCounter++;
      }, 100);
    });
  }

  function setZipCode(dataObj) {
    var addressComps;

    for (var i = 0; i < dataObj.srcData.length; i++) {
      if (dataObj.geoData[i].status === 'OK') {
        addressComps = dataObj.geoData[i].results[0].address_components;

        for (var j = addressComps.length - 1; j >= 0; j--) {
          if (addressComps[j].types[0] === 'postal_code') {
            dataObj.srcData[i].zip_code = addressComps[j].long_name;
          }
        }
      } else {
        process.stdout.write('Geocode Status: ' + dataObj.geoData[i].status + '\n');
        process.stdout.write('Location: ' + dataObj.srcData[i].location + '\n');
      }
    }
    return dataObj.srcData;
  }

  function saveDocs(modSrcData) {
    location.insertMany(modSrcData, (err) => {
      if (err) return errorHandler(err);

      mongoose.disconnect(() => {
        process.stdout.write('Database built!\n');
      });
    });
  }

  function errorHandler(err) {
    process.stderr.write(err + '\n');
    mongoose.disconnect();
  }

  return {
    getSourceData: getSourceData,
    dropCollection: dropCollection,
    getGeoData: getGeoData,
    setZipCode: setZipCode,
    saveDocs: saveDocs,
    errorHandler: errorHandler
  };
})();
