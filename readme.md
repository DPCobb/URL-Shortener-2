# Tyny
A node.js url shortener API.
- [Install](#install)
- [Usage](#using-the-app)
- [Create A User](#create-user)
- [API Endpoints](#api-endpoints)
- [Routes](#routes)
- [Post Requests](#post-requests)
- [Get Requests](#get-requests)
- [Delete Requests](#delete-requests)
- [Go To Links](#accessing-links)
- [Style Guide](#style-guide)
- [Contributing](#contributing)

## Install

To install this app download or clone the repository and install the required
packages for the project.

```
body-parser: ^1.16.0,
chai: ^3.5.0,
express: ^4.14.1,
mysql: ^2.13.0,
sequelize: ^3.30.1,
dotenv: ^4.0.0,
supertest: ^3.0.0
```
As well as the following Dev dependencies:
```
eslint: ^3.15.0,
eslint-config-airbnb: ^14.1.0,
eslint-plugin-import: ^2.2.0,
eslint-plugin-jsx-a11y: ^4.0.0,
eslint-plugin-react: ^6.9.0,
istanbul: ^0.4.5,
mocha: ^3.2.0
```
Or install required packages at once using

```
$ npm install

```

Next create your local database and add a .env file with the following fields:
```
DB_NAME = YOUR DATABASE NAME
DB_USER = YOUR USER NAME
DB_PASS = YOUR PASSWORD
DB_HOST = YOUR HOST
DB_SCHEMA = mysql
DB_PORT = MYSQL PORT
DEBUG = true
DEBUG_CONSOLE = true
DEBUG_MSG_LOG = true
```
## Using the App
There are two ways to run the app, with debug mode on or off. Running with all settings on true will create a daily log for both methods included and send messages to the console. Your .env file should contain the following
entries:
```
DEBUG = true
DEBUG_CONSOLE = true
DEBUG_MSG_LOG = true
```
These entries control the debugging tool built into the app, this tool is built to avoid using console.log and can easily control
the display of messages on production apps. To turn off all debugging features change DEBUG to false.
```
DEBUG = false
DEBUG_CONSOLE = true
DEBUG_MSG_LOG = true
```
This will turn off all debug messages and log files. If you want to keep the debug log running as an activity log but do not want
that information displayed in the console change DEBUG_CONSOLE to false.
```
DEBUG = true
DEBUG_CONSOLE = false
DEBUG_MSG_LOG = true
```
This will prevent debug messages from hitting the console. You can also choose to stop logging for the .msg() method by changing
DEBUG_MSG_LOG to false.
```
DEBUG = true
DEBUG_CONSOLE = true
DEBUG_MSG_LOG = false
```
This will turn off the logging for the .msg() method, which acts more like a traditional console.log. The logs are created in the log
folder and will create daily logs for the debug method (debug_log_YYYY_M_D.log) and the msg method (debug_MSG_YYYY_M_D.log)
### Available Debug Methods
#### .debug(data)
This method accepts a JSON object that should be structured the following way:
```
log.debug({
    type: 'success',
    msg: 'Returned URL based on ID',
    location: 'app.js line 48 GET:/urls/:id',
    data: {
        data,
    },
    request: {
        body,
    },
});
```
The type, msg, and location, fields are REQUIRED, data and request are optional. The types that should be used are: success, error, or warning. The msg can be any message you wish to send, the location
should be information relevant to where this is occurring like file, line, and route information. The data field can also be
an object, in this example data is the response from the web server or the URL information for a specific ID. The request field can
also be an object and in this example it is the request for a URL with a specific ID. The following are examples of success, error, and warning messages from the debugger, the first success message contains only the required fields.
```
**********
Event at 12:48:14 @ server.js line 34
SUCCESS
Listening to Server on Port 3000

**********
Event at 17:41:53 @ app.js line 48 GET:/urls/:id
SUCCESS
Returned URL based on ID
Returned Data:
--   data :  url : https://coderwall.com/p/yphywg/printing-colorful-text-in-terminal-when-run-node-js-script
     id :9
     tynyUrl : tyny.io/a829a00
     shortUrl : a829a00
     key : 43a995d29e
     createdAt : 2017-02-08T18:40:36.000Z
     updatedAt : 2017-02-08T18:40:36.000Z
Requested Data:
--   body :  id : 9

**********
Event at 17:41:57 @ app.js line 48 GET:/urls/:id
WARNING - REQUEST RETURNED NULL
Returned URL based on ID
Returned Data:
--   data :null
Requested Data:
--   body :  id : 999999

**********
Event at 17:42:2 @ app.js line 180 POST:/urls/:id
ERROR
Could not update short URL by ID
Returned Data:
 TypeError: Cannot read property 'updateAttributes' of null
Requested Data:
--   body :  url : https://coderwall.com/p/yphywg/printing-colorful-text-in-terminal-when-run-node-js-script
     key : 43a995d29e
     id : 999999

```  
The messages created by the debugger are the same in the console and in the daily log file.
#### .msg(msg,loc)
This method acts like more of a traditional console.log. It displays a simple message and, if provided, location info. This feature and its log can both be turned off. The msg information is required and location is not.
```
log.msg('Hello World from app.listen')
log.msg('Server Active, port 3000', 'app.js')
```
The above examples will create the following output in the console:
```
MSG: Hello World from app.listen
-- @ No Location Info
MSG: Server Active, port 3000
-- @ app.js
```
Similar outputs will be created in the log file with the addition of the time of the event:
```
-- MSG @ 12:11:28 (No Location Info): Hello World from app.listen
-- MSG @ 12:11:28 (app.js): Server Active, port 3000
```
This method is an easy way to troubleshoot features and methods or to test if data is being passed. It could also
be used as strictly a log.

### Unit Tests

To run a Unit Test ensure you have Mocha, Chai, and Istanbul installed and then in the Command Line run the following command to run tests and create a coverage report:

```
istanbul cover _mocha
```

## Create User
Although, this step is entirely optional it will allow users to search based on a user key.
To create a user send a POST request to /api/v1/create with the following data:
```
{
  "email": "example@example.com",
  "pass": "Your password"
}
```
You will then receive a response in JSON with your user key.
```
{
  "email": "example@example.com",
  "pass": "password",
  "key": "4b61109c5c"
}
```
To track your shortened links by user you should copy and keep your key! This field will
need to be added to the JSON for link creation to track by user.
## API Endpoints
The following endpoints are available through the API:
* POST -  /api/v1/create - creates a user
* POST -  /api/v1/urls - creates a shortened URL
* POST -  /api/v1/urls/{ID} - updates a link by given ID
* GET - /api/v1/urls - retrieves all URL's
* GET - /api/v1/urls/{ID} - retrieves short URL based on given ID
* GET - /api/v1/urls/user/{KEY} - retrieves all URL's generated by a specific user key
* DELETE - /api/v1/urls/{ID} - deletes a URL based on given ID

## Routes

The following routes are provided to redirect to the specific link
* /go/{ID} - Passing just the link ID will redirect to the created link
```
localhost:3000/go/{ID}
```
* /go/{TYNY URL} - Passing the entire Tyny URL will redirect to the created link
```
localhost:3000/go/{tynyUrl}
```
* /{SHORT URL} - Passing just the short URL will redirect to the created link
```
localhost:3000/{shortUrl}
```

## POST Requests
### /api/v1/create
Although, this step is entirely optional it will allow users to search based on a user key.
To create a user send a POST request to /api/v1/create with the following data:
```
{
  "email": "example@example.com",
  "pass": "Your password",
}
```
You will then receive a response in JSON with your user key.
```
{
  "email": "example@example.com",
  "pass": "password",
  "key": "4b61109c5c"
}
```
### /api/v1/urls
To shorten a URL make a POST request to /api/v1/urls and send a JSON request with the URL
you want to shorten, and optionally your key. Example:
```
{
	"url":"https://github.com/DPCobb/URL-Shortener",
	"key" : "YOUR KEY"
}
```
This will then take your URL and parse it into a shortened URL. The API will then
return a JSON response with your new URL. Example:
```
{
  "url": "https://github.com/DPCobb/URL-Shortener",
  "tynyUrl": "tyny.io/8d10273",
  "shortUrl": "8d10273",
  "key": "43a995d29e"
}
```
### /api/v1/urls/{ID}
To update a URL make a POST request to /api/v1/urls/{ID} where {ID} is the URL ID. The JSON
request should contain only the data you wish to update. The following example will update the URL of the
given post.
```
{
  "url": "http://www.google.com"
}
```
The API will then send the following response:
```
{
  "url": "http://www.google.com",
  "id": 1,
  "tynyUrl": "tyny.io/7fdcdf0",
  "shortUrl": "7fdcdf0",
  "key": "43a995d29e",
  "createdAt": "2017-02-05T19:49:59.000Z",
  "updatedAt": "2017-02-05T20:11:27.000Z"
}
```

## GET Requests

### /api/v1/urls
Sending a GET request to /api/v1/urls will return all of the created URL's:
```
[
  {
    "url": "http://www.google.com",
    "id": 1,
    "tynyUrl": "tyny.io/7fdcdf0",
    "shortUrl": "7fdcdf0",
    "key": "43a995d29e",
    "createdAt": "2017-02-05T19:49:59.000Z",
    "updatedAt": "2017-02-05T20:11:27.000Z"
  },
  {
    "url": "https://github.com/DPCobb/URL-Shortener",
    "id": 4,
    "tynyUrl": "tyny.io/8d10273",
    "shortUrl": "8d10273",
    "key": "43a995d29e",
    "createdAt": "2017-02-05T20:16:49.000Z",
    "updatedAt": "2017-02-05T20:16:49.000Z"
  }
]
```
### /api/v1/urls/{ID}
This GET request will return the information for a single URL based on the ID given, passing ID 1 will return a response of:
```
{
  "url": "http://www.google.com",
  "id": 1,
  "tynyUrl": "tyny.io/7fdcdf0",
  "shortUrl": "7fdcdf0",
  "key": "43a995d29e",
  "createdAt": "2017-02-05T19:49:59.000Z",
  "updatedAt": "2017-02-05T20:11:27.000Z"
}
```
### /api/v1/urls/users/{KEY}
This GET request will return all the generated URL's for a given user key, in our example adding the key "43a995d29e" would return the following data:
```
[
  {
    "url": "http://www.google.com",
    "id": 1,
    "tynyUrl": "tyny.io/7fdcdf0",
    "shortUrl": "7fdcdf0",
    "key": "43a995d29e",
    "createdAt": "2017-02-05T19:49:59.000Z",
    "updatedAt": "2017-02-05T20:11:27.000Z"
  },
  {
    "url": "https://github.com/DPCobb/URL-Shortener",
    "id": 4,
    "tynyUrl": "tyny.io/8d10273",
    "shortUrl": "8d10273",
    "key": "43a995d29e",
    "createdAt": "2017-02-05T20:16:49.000Z",
    "updatedAt": "2017-02-05T20:16:49.000Z"
  }
]
```

## Delete Requests
### /api/v1/urls/{ID}

Sending a delete request to /api/v1/urls/{ID} where ID is the URL ID will delete the data for that URL and, if successful, return a 1, if the delete fails a 0 will be returned.

## Accessing links

There are three ways to redirect to a given URL. For this we will use the data from the following returned URL to build our links:
```
{
  "url": "http://www.google.com",
  "id": 1,
  "tynyUrl": "tyny.io/7fdcdf0",
  "shortUrl": "7fdcdf0",
  "key": "43a995d29e",
  "createdAt": "2017-02-05T19:49:59.000Z",
  "updatedAt": "2017-02-05T20:11:27.000Z"
}
```
* /go/{ID} - Passing just the link ID will redirect to the created link
```
localhost:3000/go/1
```
* /go/{TYNY URL} - Passing the entire Tyny URL will redirect to the created link
```
localhost:3000/go/tyny.io/7fdcdf0
```
* /{SHORT URL} - Passing just the short URL will redirect to the created link
```
localhost:3000/7fdcdf0
```
## Style Guide
This project currently uses the Airbnb JS Style Guide found [here](https://github.com/airbnb/javascript).
The easiest way to ensure contributions adhere to the same style guide is to use an IDE that supports an
ESLint plugin. For example, [Atom](https://atom.io) supports ESLint with their package ['linter-eslint'](https://github.com/AtomLinter/linter-eslint). To ensure contributions adhere to the Airbnb style guide
install ESLint, and install the following dev dependencies:
```
"eslint": "^3.15.0",
"eslint-config-airbnb": "^14.1.0",
"eslint-plugin-import": "^2.2.0",
"eslint-plugin-jsx-a11y": "^4.0.0",
"eslint-plugin-react": "^6.9.0"
```

As well as adding a .eslintrc.json file with the following:
```
{
	"env": {
		"node": true
	},
	"extends": "airbnb",
	"plugins": [
        "react"
    ],
	"rules": {
		"new-cap": 0,
		"prefer-template": 0,
		"global-require": 0
	},
	"globals": {
		"describe": true,
		"it": true
	}
}
```
Installation information can also be found [here](https://www.npmjs.com/package/eslint-config-airbnb).

## Contributing
To contribute to this project please [create a new pull request](https://help.github.com/articles/creating-a-pull-request/). Additionally,
the following requirements should be met:
* A good description of the pull request, what it is and why it is needed.
* If creating a new feature please update the readme.md file with documentation
including endpoints and examples.
* Lastly, try to keep the coding style similar to the existing API.
