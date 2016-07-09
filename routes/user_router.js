const Router = require('express').Router;
const User = require(__dirname + '/../models/user.js');
const TwimlResponse = require('twilio').TwimlResponse;

var userRouter = module.exports = exports = Router();

//hmm you seem to have two routes with the same url
//I see a /signup in your auth router as well
userRouter.get('/signup', (req, res) => {
  if (req.query.From) {
    var newUser = new User({ phone_number: req.query.From });
    var resp = new TwimlResponse();
    newUser.save();
    resp.message('Next Meal\n Your # has been\nadded to our database\n'
    + 'To get Meal Locations\n text:\n Breakfast, Lunch or Dinner\nto:\n 4252766480');
    res.type('text/xml');
    res.send(resp.toString());
  } else {
    res.send('Please Text 206-429-6617 to sign-up for Next-Meal');
  }
});
