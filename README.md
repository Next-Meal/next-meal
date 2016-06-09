# Next Meal [![Build Status](https://travis-ci.org/Next-Meal/next-meal.svg?branch=master)](https://travis-ci.org/Next-Meal/next-meal)

Next Meal is an informational tool to assist those in need by helping them find local meal programs. You can view the deployed web app at <https://next-meal.herokuapp.com>.

Source data is gathered from <https://data.seattle.gov>, and geocode data from <https://maps.googleapi.com>.

It is possible to run this application locally, but you will not be able to fetch the data required to build the database unless you have the correct API keys set in your local environment.

## Meal Information

Meal information can be retrieved from our server in three ways:
  1. HTTP Request
  2. SMS Request
  3. Voice Request

### HTTP Request

If you wish to access the API server directly, Next Meal has a number of routes that will allow you to fetch data in a JSON format. To get all current information, an HTTP GET request can be made to:

```
https://next-meal.herokuapp.com/api/meals
```

Alternatively, a subset of the data can be retrieved by appending filters to the URL. For example, appending 'breakfast' will return only the locations that serve breakfast, or appending 'women' will return locations that specifically serve women. Below are the current routes that provide filtered information:

```
/api/meals/breakfast
/api/meals/lunch
/api/meals/snack
/api/meals/dinner
/api/meals/everyone
/api/meals/men
/api/meals/women
/api/meals/youth
/api/meals/children
```

### SMS Request

Next Meal allows for information to be requested via SMS messaging. Next Meal will receive SMS messaging and respond with the requested information.

To receive a response:

  1. Send a SMS (text) message to the following phone number:
        **425-276-6480**

  2. The text message should contain one of the meal filters listed above. For example, texting 'lunch' will retrieve only the locations that serve lunch.

  3. When using SMS to obtain information, the application will filter results by the current day of the week.

### Voice Request

Next Meal also allows for meal information to be requested through phone messages. To receive a response:

  1. Call: **206-429-6617**

  2. The user will be prompted to select: (1) for breakfast, (2) for lunch, or (3) for dinner.

  3. Next Meal will respond with two different location options.

### Registration

Although it is not required, users may register their phone number with Next Meal. In a future implementation, Next Meal will be able to send news and updates to users via SMS. Text 'register' to **206-429-6617** from the device that you wish to register.
