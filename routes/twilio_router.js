const Router = require('express').Router;
const bodyParser = require('body-parser').urlencoded({
  extended: false
});
const https = require('https');
const errorHandler = require(__dirname + '/../lib/error_handler');
const twilio = require('twilio');

var TwimlResponse = require('twilio').TwimlResponse;

var twilioRouter = module.exports = exports = Router();
var dataPath = 'https://data.seattle.gov/resource/47rs-c243.json';

twilioRouter.get('/sms', bodyParser, (req, res) => {
  https.get(dataPath + '?meal_served=' + req.query.Body.slice(2), (response) => {
    var slicedBody = req.query.Body.slice(0,1);
    var smsBody = req.query.Body.slice(2);
    var smsNumber = req.query.From;
    var smsCity = req.query.FromCity;
    var smsState = req.query.FromState;
    var smsZip = req.query.FromZip;
    console.log('message body: ' + smsBody);
    console.log('from Phone-Number: ' + smsNumber);
    console.log('sent from city: ' + smsCity);
    console.log('sent from state: ' + smsState);
    console.log('sent from zip-code: ' + smsZip);
    var str = '';
    response.setEncoding('utf8');
    response.on('data', function(data) {
      str += data;
    })
    response.on('end', function() {
      var jsonObj = JSON.parse(str);
      console.log(jsonObj[slicedBody]);
      var resp = new TwimlResponse();
      resp.message('Next-Meal\nMeal Locations:' + jsonObj.length + '\n' + 'This Location:' + slicedBody + '\n' + jsonObj[slicedBody].day_time + '\n' + jsonObj[slicedBody].location + '\n' + jsonObj[slicedBody].people_served);
      res.type('text/xml');
      console.log(resp.toString());
      res.send(resp.toString());
    })
  })
})
