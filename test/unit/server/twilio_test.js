const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const dayFilter = require(__dirname + '/../../../lib/day_filter');

describe('twilio router filters', () => {

  it('should bring back current date in abbrev string form', () => {
    var currentDate = new Date();
    var currentDay = currentDate.getDay();
    var dateArray = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    expect(dateArray[currentDay]).to.eql(dayFilter.getStringDay());
  });

  it('should filter results with the day-matching filter', () => {
    var filteredDay = dayFilter.getStringDay();
    var testArray = [
      { 'day_time': 'Monday - Friday: 6:15 - 7:00 A.M.',
        'location': '2515 Western Ave., Seattle',
        'meal_served': 'Breakfast',
        'name_of_program': 'Millionair Club Charity',
        'people_served': 'OPEN TO ALL ' },
      { 'day_time': 'Sunday - Thursday 5:30 - 8:30 A.M.',
        'location': '8201 10th Ave S.,  Seattle',
        'meal_served': 'Breakfast', 'name_of_program': 'South Park Breakfast Bunch',
        'people_served': 'OPEN TO ALL' },
      { 'day_time': 'Monday - Friday 7:00 - 9:30 A.M.',
        'location': '410 2nd Ave. Extension So.,  Seattle',
        'meal_served': '  ',
        'name_of_program': 'Chief Seattle Club',
        'people_served': 'AMERICAN INDIANS ONLY' }
    ];
    var results1 = dayFilter.matchDay(testArray, 'sat');
    var results2 = dayFilter.matchDay(testArray, 'fri');
    var results3 = dayFilter.matchDay(testArray, 'notaday');
    var results4 = dayFilter.getDaysOpen(testArray);
    expect(Array.isArray(dayFilter.matchDay(testArray, filteredDay))).to.eql(true);
    expect(results1.length).to.eql(0);
    expect(results2.length).to.eql(2);
    expect(results3.length).to.eql(0);
    expect(Array.isArray(dayFilter.getDaysOpen(testArray))).to.eql(true);
    expect(results4[0]).to.have.property('daysOpen');
  });
});
