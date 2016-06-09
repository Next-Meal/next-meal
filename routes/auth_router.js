const express = require('express');
const Organization = require(__dirname + '/../models/organization');
const jsonParser = require('body-parser').json();
const basicHTTP = require(__dirname + '/../lib/basic_http');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');

var router = module.exports = exports = express.Router();

router.post('/signup', jsonParser, (req, res) => {
  var password = req.body.password;
  req.body.password = null;
  if (!password) return res.status(500).json({ msg: 'password field must not be empty' });

  var newOrganization = new Organization(req.body);
  newOrganization.generateHash(password);
  password = null;

  newOrganization.save((err, orgs) => {
    if (err) return res.status(500).json({ msg: err });

    orgs.generateToken(function(err, token) {
      if (err) return res.status(500).json({ msg: 'could not generate token.' });
      res.json({ token });
    });
  });
});

router.get('/signin', basicHTTP, (req, res) => {
  Organization.findOne({ organizationName: req.auth.organizationName }, (err, user) => {
    if (err) return res.status(500).json({ msg: 'authentication error' });
    if (!user) return res.status(500).json({ msg: 'no user error' });
    if (!user.compareHash(req.auth.password)) {
      return res.status(500).json({ msg: 'comparehash error' });
    }
    user.generateToken(function(err, token) {
      if (err) return res.status(500).json({ msg: 'could not generate token' });

      res.json({ token });
    });
  });
});
router.get('/profile', jwtAuth, function(req, res) {
  res.send({ organizationName: req.organization.organizationName });
});
