const express = require('express');
const Organization = require(__dirname + '/../models/organization');
const jsonParser = require('body-parser').json();

var router = module.exports = exports = express.Router();

router.post('/signup', jsonParser, (req, res) => {
  var password = req.body.password;
  req.body.password = null;
  if (!password) return res.status(500).json({msg: 'password field must not be empty'});

  var newOrganization = new Organization(req.body);
  newOrganization.generateHash(password);
  password = null;

  newOrganization.save((err, data) => {
    if (err) return res.status(500).json({msg: err});
    res.json({msg: 'user created!'});
  });
});
// router.get('/signin')
