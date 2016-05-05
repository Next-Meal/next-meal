/* eslint-disable camelcase */

const Router = require('express').Router;
const User = require(__dirname + '/../models/user.js');
var TwimlResponse = require('twilio').TwimlResponse;

var userRouter = module.exports = exports = Router();

userRouter.get('/signup', (req, res) => {
  if (req.query.From) {
    var newUser = new User({ phone_number: req.query.From });
    newUser.save();
    var resp = new TwimlResponse();
    resp.message('Next Meal\n Your # has been\nadded to our database\n'
    + 'To get Meal Locations\n text:\n Breakfast, Lunch or Dinner\nto:\n 4252766480');
    res.type('text/xml');
    res.send(resp.toString());
  } else {
    res.send('Please Text 206-429-6617 to sign-up for Next-Meal');
  }
});
