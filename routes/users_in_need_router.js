/* eslint-disable camelcase */

const Router = require('express').Router;
const UsersInNeed = require(__dirname + '/../models/users_in_need');
var TwimlResponse = require('twilio').TwimlResponse;

var userInNeedRouter = module.exports = exports = Router();

userInNeedRouter.get('/signup', (req, res) => {
  console.log(req.query.From);
  var newUser = new UsersInNeed({ phone_number: req.query.From });
  newUser.save();
  var resp = new TwimlResponse();
  resp.message('Next Meal\n Your # has been\nadded to our database\n'
  + 'To get Meal Locations\n text:\n Breakfast, Lunch or Dinner\nto:\n 4252766480');
  res.type('text/xml');
  res.send(resp.toString());
});
