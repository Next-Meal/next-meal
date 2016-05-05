/* eslint-disable eqeqeq */
/* eslint-disable camelcase */

const Router = require('express').Router;
const twilio = require('twilio');
const location = require(__dirname + '/../models/location');

var dayFilter = require(__dirname + '/../lib/day_filter');

var voiceRouter = module.exports = Router();

voiceRouter.post('/', (req, res) => {
  var resp = new twilio.TwimlResponse();
  resp.say('Welcome to next meal!')
  .gather({
    action: '/voice/response',
    numDigits: '1',
    method: 'GET'
  }, function() {
    this.say('Press 1 for Breakfast')
    .say('Press 2 for Lunch')
    .say('Press 3 for Dinner');
  });
  console.log(resp.toString());
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(resp.toString());
});

voiceRouter.get('/response', (req, res) => {
  var phoneResponse = req.query.Digits;
  var lookupMeal;
  if (phoneResponse == 1) {
    lookupMeal = 'Breakfast';
  }
  if (phoneResponse == 2) {
    lookupMeal = 'Lunch';
  }
  if (phoneResponse == 3) {
    lookupMeal = 'Dinner';
  }
  if (phoneResponse == 7) {
    var songUrl = 'https://ia600805.us.archive.org/27/items/NeverGonnaGiveYouUp/jocofullinterview41.mp3';
    var twiml = new twilio.TwimlResponse();
    twiml.play(songUrl);
    res.header('Content-Type', 'text/xml');
    res.end(twiml.toString());
  }
  location.find({ meal_served: lookupMeal }, (err, data) => {
    if (!err) console.log(data);

    var currentDay = dayFilter.getStringDay();
    var results = dayFilter.matchDay(data, currentDay);
    var resp = new twilio.TwimlResponse();

    resp.say(
      'Result 1. meal served.' + results[0].meal_served
      + '.. Location: ' + results[0].location + '.. Meals Served..'
      + results[0].day_time + '..' + results[0].people_served +
      '.. Result 2. meal served.' + results[1].meal_served
      + '.. Location: ' + results[1].location + '.. Meals Served.'
      + results[1].day_time + '..' + results[1].people_served
      + '.. Thank you for calling Next-Meal. Goodbye.');

    res.writeHead(200, {
      'Content-Type': 'text/xml'
    });
    res.end(resp.toString());
  });
});
