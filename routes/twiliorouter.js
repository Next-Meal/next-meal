/* eslint-disable camelcase */

const Router = require('express').Router;
const location = require(__dirname + '/../models/location');

var TwimlResponse = require('twilio').TwimlResponse;
var twilioRouter = module.exports = exports = Router();

twilioRouter.get('/sms', (req, res) => {
  console.log(req.query.Body);
  if (!(req.query.Body === 'Breakfast' || req.query.Body ===
  'Lunch' || req.query.Body === 'Dinner')) {
    console.log('User Entered incorrect meal parameter');
    var resp = new TwimlResponse();
    resp.message('Next Meal\n You Must Enter Either:\nBreakfast\nLunch\nor\nDinner');
    res.type('text/xml');
    console.log(resp.toString());
    res.send(resp.toString());
  } else {
    location.find({ meal_served: req.query.Body }, (err, data) => {
      if (!err) console.log(data);
      var smsBody = req.query.Body;
      var smsNumber = req.query.From;
      var smsCity = req.query.FromCity;
      var smsState = req.query.FromState;
      var smsZip = req.query.FromZip;
      console.log('message body: ' + smsBody);
      console.log('from Phone-Number: ' + smsNumber);
      console.log('sent from city: ' + smsCity);
      console.log('sent from state: ' + smsState);
      console.log('sent from zip-code: ' + smsZip);
      var str = data;
      console.log('\nLINE SPLIT\n' + str[1] + '\n2ND LINE SPLIT\n' + str[2]);
      var resp = new TwimlResponse();
      resp.message('Next-Meal\n' + str[0].meal_served + '\n' + str[0].location + '\n'
       + str[0].day_time + '\n' + str[0].people_served + '\n' + str[1].meal_served + '\n'
        + str[1].location + '\n' + str[1].day_time + '\n' + str[1].people_served + '\n'
         + str[2].meal_served + '\n' + str[2].location + '\n' + str[2].day_time + '\n'
          + str[2].people_served + '\n');
      res.type('text/xml');
      console.log(resp.toString());
      res.send(resp.toString());
    });
  }
});
