# Weather-app

```
This is a build of a weather app developed using the following libraries:
```
- React.js
- Babel 7
- Webpack
- Axios
- Moment
- Recharts
- Material UI

# Features
- Current weather 
- Weather forecast
- Search location/city

# Data API
For the actual weather data the App uses `https://openweathermap.org/api` together with the user's GPS using the `HTML Geolocation API` .
# Geo fall-back API
```
# If no Geo data is available then an approximation is made using the users IP address together with the `https://json.geoiplookup.io` service.
```
# CORS
```
A workaround for the https (Weather-app) to http (Openweathermap API) is made using `https://cors-anywhere.herokuapp.com`
```
