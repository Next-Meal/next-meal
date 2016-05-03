/* eslint-disable camelcase */

const Router = require('express').Router;
const location = require(__dirname + '/../models/location');

var TwimlResponse = require('twilio').TwimlResponse;
var twilioRouter = module.exports = exports = Router();
var dayFilter = require(__dirname + '/../lib/day_filter');

twilioRouter.get('/sms', (req, res) => {
  if (!(req.query.Body === 'Breakfast' || 'Lunch' || 'Dinner')) {
    var resp = new TwimlResponse();

    resp.message('Next Meal\n You Must Enter Either:\nBreakfast\nLunch\nor\nDinner');
    res.type('text/xml');
    res.send(resp.toString());
  } else {
    location.find({ meal_served: req.query.Body }, (err, data) => {
      if (!err) console.log(data);

      var currentDay = dayFilter.getStringDay();
      var results = dayFilter.matchDay(data, currentDay);
      var resp = new TwimlResponse();

      resp.message('Next-Meal\n'
        + results[0].meal_served + '\n' + results[0].location + '\n'
        + results[0].day_time + '\n' + results[0].people_served + '\n'
        + results[1].meal_served + '\n' + results[1].location + '\n'
        + results[1].day_time + '\n' + results[1].people_served + '\n'
        + results[2].meal_served + '\n' + results[2].location + '\n'
        + results[2].day_time + '\n' + results[2].people_served + '\n');

      res.type('text/xml');
      res.send(resp.toString());
    });
  }
});
