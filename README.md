# next-meal [![Build Status](https://travis-ci.org/Next-Meal/next-meal.svg?branch=master)](https://travis-ci.org/Next-Meal/next-meal)

Next-meal is an informational tool to assist those in need by helping them find local meal programs. The web API is deployed at <https://next-meal.herokuapp.com>.

Information is gathered from <https://data.seattle.gov>.

## Routes

Meal information can be retrieved in three ways:
  1. HTTP Request
  2. SMS Request
  3. Voice Request

### HTTP Request

Next-meal has several routes that allow for information to be retrieved in a filtered format.
To get all current information, an http GET request can be made to:

```
/api/meals
```

Alternatively, locations that serve specific meals or people can be retrieved.
For example, retrieving 'breakfast' will return locations that serve breakfast. Or retrieving 'women' will return locations that specifically serve women.  Below are the current routes with filtered information:

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

Next-Meal allows for information to be requested via SMS messaging. Next-Meal will receive SMS messaging and respond with the requested information.

To receive a response:

  1. Send a SMS (text) message to the following phone number:
        **425-276-6480**

  2. The text message should contain one of the meal filters above.  For example, one could text 'breakfast' and retrieve filtered locations serving breakfast.

  3. When using SMS to obtain information, the application will filter results by the current day of the week.

### Voice Request

Next-Meal also allows for meal information to be requested through phone messages. To receive a response:

  1. Call: **206-429-6617**

  2. The user will be prompted to select: (1) for breakfast, (2) for lunch, or (3) for dinner.

  3. Next meal will respond with two different location options.

### Registration

Although it is not required, users may register their phone number with Next-Meal. In a future implementation, Next-Meal will be able to send news and updates to users via SMS. Text 'register' to **206-429-6617** from the device that you wish to register.
