/* eslint-disable camelcase */
const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const errorHandler = require(__dirname + '/../lib/error_handler');
const location = require(__dirname + '/../models/location');

var mealRouter = module.exports = exports = Router();

mealRouter.get('/meals', (req, res) => {
  location.find(null, (err, data) => {
    if (err) return errorHandler(err, res, 500);

    res.status(200).json(data);
  });
});

mealRouter.get('/meals/breakfast', bodyParser, (req, res) => {
  location.find({ meal_served: 'Breakfast' }, (err, data) => {
    if (err) return errorHandler(err, res, 500);

    res.status(200).json(data);
  });
});

mealRouter.get('/meals/lunch', bodyParser, (req, res) => {
  location.find({ meal_served: 'Lunch' }, (err, data) => {
    if (err) return errorHandler(err, res, 500);

    res.status(200).json(data);
  });
});

mealRouter.get('/meals/dinner', bodyParser, (req, res) => {
  location.find({ meal_served: 'Dinner' }, (err, data) => {
    if (err) return errorHandler(err, res, 500);

    res.status(200).json(data);
  });
});
