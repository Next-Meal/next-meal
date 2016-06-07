const Router = require('express').Router;
const errorHandler = require(__dirname + '/../lib/error_handler');
const location = require(__dirname + '/../models/location');

var mealRouter = module.exports = exports = Router();

mealRouter.get('/meals', (req, res) => {
  location.find(null, (err, data) => {
    if (err) return errorHandler(err, res, 500);

    res.status(200).json(data);
  });
});

mealRouter.get('/meals/:filter', (req, res) => {
  var keyMap = {
    breakfast: { meal_served: 'Breakfast' },
    lunch: { meal_served: 'Lunch' },
    snack: { meal_served: 'Snack' },
    dinner: { meal_served: 'Dinner' },
    everyone: { people_served: /open to all/i },
    men: { people_served: /(^#.|[^o]|[^w]o)men/i },
    women: { people_served: /women/i },
    youth: { people_served: /youth/i },
    children: { people_served: /children/i }
  };

  if (keyMap[req.params.filter]) {
    return location.find(keyMap[req.params.filter], (err, data) => {
      if (err) return errorHandler(err, res, 500);

      res.status(200).json(data);
    });
  }

  errorHandler(new Error('404 - Page Not Found'), res, 404);
});
