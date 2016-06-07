const Organization = require(__dirname + '/../models/organization');
const jwt = require('jsonwebtoken');

module.exports = exports = function(req, res, next) {
  jwt.verify(req.headers.token, process.env.APP_SECRET, function(err, decoded) {
    if (err) return res.status(403).json({ msg: 'could not authenticate' });

    Organization.findOne({ findHash: decoded.idd }, function(err, data) {
      if (err) return res.status(403).json({ msg: 'could not authenticate' });

      if (!data) return res.status(403).json({ msg: 'no organization error' });

      req.organization = data;
      next();
    });
  });
};
