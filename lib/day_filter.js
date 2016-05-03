/* eslint-disable no-extend-native */

Date.prototype.getDayOfWeek = function() {
  return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
};

module.exports = exports = {

  getStringDay: function() {
    var day = new Date();
    var currentDay = day.getDayOfWeek()[day.getDay()];
    return currentDay;
  },

  matchDay: function(array, currentDay) {
    var results = [];
    var dayArray = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var dayIndex = dayArray.indexOf(currentDay);

    for (var i = 0; i < array.length; i++) {
      var sub = array[i].day_time.toLowerCase();

      if (sub.includes(currentDay) || sub.includes('daily')) {
        results.push(array[i]);

      } else if (sub.indexOf(' - ')) {

        var index = sub.indexOf(' - ');
        var start = index - 7;
        var end = index + 6;

        for (var j = 0; j < dayIndex; j++) {
          if (sub.substring(start, index).includes(dayArray[j])) {
            for (var k = dayArray.length; k > dayIndex; k--) {
              if (sub.substring(index, end).includes(dayArray[k])) {
                results.push(array[i]);
              }
            }
          }
        }
      }
    }
    return results;
  }
};
