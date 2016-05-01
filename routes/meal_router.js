
const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const https = require('https');

var mealRouter = module.exports = exports = Router();
var dataPath = 'https://data.seattle.gov/resource/47rs-c243.json';

mealRouter.get('/meals', bodyParser, (req, res) => {
  https.get(dataPath, (data) => {
    console.log('status code: ' + data.statusCode);
    console.log('headers: ' + data.headers);

    data.pipe(res);

  }).on('error', (err) => {
    process.stderr.write('got this err: ' + err + '\n');
  });
});

mealRouter.get('/meals/breakfast', bodyParser, (req, res) => {
  https.get(dataPath + '?meal_served=Breakfast', (data) => {
    console.log('status code: ' + data.statusCode);
    console.log('headers: ' + data.headers);

    data.pipe(res);

  }).on('error', (err) => {
    process.stderr.write('got this err: ' + err + '\n');
  });
});

mealRouter.get('/meals/lunch', bodyParser, (req, res) => {
  https.get(dataPath + '?meal_served=Lunch', (data) => {
    console.log('status code: ' + data.statusCode);
    console.log('headers: ' + data.headers);

    data.pipe(res);

  }).on('error', (err) => {
    process.stderr.write('got this err: ' + err + '\n');
  });
});

mealRouter.get('/meals/dinner', bodyParser, (req, res) => {
  https.get(dataPath + '?meal_served=Dinner', (data) => {
    console.log('status code: ' + data.statusCode);
    console.log('headers: ' + data.headers);

    data.pipe(res);

  }).on('error', (err) => {
    process.stderr.write('got this err: ' + err + '\n');
  });
});
