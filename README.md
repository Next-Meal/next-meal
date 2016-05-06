# next-meal ![Travis CI build icon](https://travis-ci.org/Next-Meal/next-meal.svg?branch=master)

Next-meal is an informational tool to assist those in need by helping them find local meal programs.
Information is gathered from <https://data.seattle.gov>.

## Routes

Meal information can be retrieved in two ways:
  1. HTTP Request
  2. SMS Request

### HTTP Request

Next-meal has several routes that allow for information to be retrieved in a filtered format.
To get all current information, an http GET request can be made to:

```
/api/meals
```

Alternatively, locations that serve specific meals or people can be retrieved.
For example, retrieving 'breakfast' will return locations that server breakfast. Or retrieving 'women' will return locations that specifically serve women.  Below are the current routes with filtered information:

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

Next-meal allows for information to be requested via SMS messaging. Next meal will receive SMS messaging and response with a filtered response.

To receive a response:

  1. Send a SMS (text) message to the following phone number:
        **425-276-6480**

  2. The text message should contain one of the meal filters above.  For example, one could text 'breakfast' and retrieve filtered locations serving breakfast.

  3. When using SMS to obtain information, the application will filter results by the current day of the week.

### Voice Request

Next-meal also allows for meal information to be requested through phone messages.  To receive a response:

  1. Call: **206-429-6617**

  2. The user will be prompted to select: (1) for breakfast, (2) for lunch, or (3) for dinner.

  3. Next meal will respond with two different location.

### Registering

While using the above methods does not require registering.  Users can register their phone number with next-meal.  In a future implementation, next-meal will be able to send automated messages to users.  To register, text 'register' to **206-429-6617**
