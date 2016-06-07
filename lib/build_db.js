const https = require('https');
const mongoose = require('mongoose');
const location = require(__dirname + '/../models/location');

function getSourceData(sourceUrl) {
  return new Promise((resolve, reject) => {
    https.get(sourceUrl, (res) => {
      var data = '';

      process.stdout.write('Source data status: ' + res.statusCode + '\n');

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        var srcData = JSON.parse(data);

        if (srcData.error) reject(new Error(srcData.message));

        resolve(srcData);
      });
    }).on('error', () => {
      reject(new Error('Could not retrieve source data!'));
    });
  });
}

function dropCollection(srcDataArr) {
  return new Promise((resolve, reject) => {
    mongoose.connection.db.listCollections({ name: 'locations' })
    .next((err, collections) => {
      if (err) reject(new Error('Could not access database collections!'));

      if (collections) {
        return mongoose.connection.db.dropCollection('locations', (err) => {
          if (err) reject(new Error('Could not drop collection!'));

          resolve(srcDataArr);
        });
      }
      resolve(srcDataArr);
    });
  });
}

function getGeoData(googleUrl, apiKey, srcData) {
  return new Promise((resolve, reject) => {
    var srcDataArr = srcData || [];
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
        https.get(googleUrl + doc.location + '&key=' + apiKey, (res) => {
          var data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            var geoData = JSON.parse(data);

            if (geoData.error_message) reject(new Error(geoData.error_message));

            geoDataArr[intervalCounter] = geoData;
            dataCounter++;

            if (dataCounter === srcDataArr.length) {
              dataObj.geoData = geoDataArr;
              resolve(dataObj);
            }
          });
        }).on('error', () => {
          reject(new Error('Could not retrieve geo data!'));
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
    if (err) return errorHandler(new Error('Could not save documents to database!'));

    mongoose.disconnect(() => {
      process.stdout.write('Database built!\n');
    });
  });
}

function errorHandler(err) {
  process.stderr.write(err + '\n');
  mongoose.disconnect();
}

module.exports = exports = {
  getSourceData: getSourceData,
  dropCollection: dropCollection,
  getGeoData: getGeoData,
  setZipCode: setZipCode,
  saveDocs: saveDocs,
  errorHandler: errorHandler
};
