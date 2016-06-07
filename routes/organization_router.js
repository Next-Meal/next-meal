const Router = require('express').Router;
const errorHandler = require(__dirname + '/../lib/error_handler');
const location = require(__dirname + '/../models/location');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');

var mealRouter = module.exports = exports = Router();

mealRouter.get('/organization_meals', jwtAuth, (req, res) => {
  location.find({ wranglerId: req.user._id }, (err, data) => {
    if (err) return errorHandler(err, res, 500);

    res.status(200).json(data);
  });
});
// TODO: need to add POST route for organization specific locations...
