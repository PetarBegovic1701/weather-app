# Weather-app

This is a build of a weather app developed using the following libraries:

- React.js
- Babel 7
- Webpack
- Axios
- Moment
- Recharts
- Material UI

## Features
- Current weather 
- Weather forecast
- Search location/city

## Data API
For the actual weather data the App uses `https://openweathermap.org/api` together with the user's GPS using the `HTML Geolocation API` .

## Geo fall-back API
If no Geo data is available then an approximation is made using the users IP address together with the `https://json.geoiplookup.io` service.

## CORS
A workaround for the https (Weather-app) to http (Openweathermap API) is made using a fork of `https://github.com/Rob--W/cors-anywhere` hosted on Heroku - `https://cors-me-first.herokuapp.com/`.

## Source code
You can find the source code in the folder `source` with its own `READme.md`.

## Note
The build size is over 1MB which is well above the optimization standard for an app of this size. The reason for is because the `Recharts` library has a dependency to `Lodash`, the entire `Lodash`.
I will transition to a different chart library in time. 