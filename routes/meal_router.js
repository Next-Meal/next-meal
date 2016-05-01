
const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const https = require('https');
const errorHandler = require(__dirname + '/../lib/error_handler');

var mealRouter = module.exports = exports = Router();
var dataPath = 'https://data.seattle.gov/resource/47rs-c243.json';

mealRouter.get('/meals', bodyParser, (req, res) => {
  https.get(dataPath, (data) => {
    console.log('status code: ' + data.statusCode);
    console.log('headers: ' + data.headers);

    data.pipe(res);

  }).on('error', (err) => {
    errorHandler(err, res, 500, 'Could not retrieve data');
  });
});

mealRouter.get('/meals/breakfast', bodyParser, (req, res) => {
  https.get(dataPath + '?meal_served=Breakfast', (data) => {
    console.log('status code: ' + data.statusCode);
    console.log('headers: ' + data.headers);

    data.pipe(res);

  }).on('error', (err) => {
    errorHandler(err, res, 500, 'Could not retrieve data');
  });
});

mealRouter.get('/meals/lunch', bodyParser, (req, res) => {
  https.get(dataPath + '?meal_served=Lunch', (data) => {
    console.log('status code: ' + data.statusCode);
    console.log('headers: ' + data.headers);

    data.pipe(res);

  }).on('error', (err) => {
    errorHandler(err, res, 500, 'Could not retrieve data');
  });
});

mealRouter.get('/meals/dinner', bodyParser, (req, res) => {
  https.get(dataPath + '?meal_served=Dinner', (data) => {
    console.log('status code: ' + data.statusCode);
    console.log('headers: ' + data.headers);

    data.pipe(res);

  }).on('error', (err) => {
    errorHandler(err, res, 500, 'Could not retrieve data');
  });
});
