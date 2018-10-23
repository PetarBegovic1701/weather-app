const axios = require('axios');
const apiKey = "API KEY HERE"
// export const apiUrl = process.env.NODE_ENV === 'development' ? 'http://192.168.0.50:8080' : location.origin;

class Api {
  // static baseApi = apiUrl
  constructor() {}
}

export class UserApi extends Api {
  constructor() {
    super();
  }

  static weather = (data) => {
    let url = `https://cors-me-first.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&units=metric&APPID=${apiKey}`

    return axios.get(url, data)
      .then((res) => res.data)
      .catch((e) => {
        console.error(e);
      });
  };

  static forecast = (data) => {
    let url = `https://cors-me-first.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?lat=${data.lat}&lon=${data.lon}&units=${data.units}&APPID=${apiKey}`

    return axios.get(url, data)
      .then((res) => res.data)
      .catch((e) => {
        console.error(e);
      });
  };

  static searchForWeather = (data) => {
    let url = `https://cors-me-first.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=${data.location}&units=metric&APPID=${apiKey}`

    return axios.get(url, data)
      .then((res) => res.data)
      .catch((e) => {
        console.error(e);
      });
  };

  static searchForForecast = (data) => {
    let url = `https://cors-me-first.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=${data.location}&units=metric&APPID=${apiKey}`

    return axios.get(url, data)
      .then((res) => res.data)
      .catch((e) => {
        console.error(e);
      });
  };

  static ipAddress = () => {
    let url = "https://cors-me-first.herokuapp.com/http://ip-api.com/json"

    return axios.get(url)
      .then((res) => res.data)
      .catch((e) => {
        console.error(e);
      });
  };

  static ipDbAddress = () => {
    let url = "https://json.geoiplookup.io"
    let urlFallback = "https://get.geojs.io/v1/ip/geo.json"

    return axios.get(url)
      .then((res) => res.data)
      .catch((e) => {
        console.warn("json.geoiplookup.io not available, falling back to get.geojs.io");
        console.error(e);
        return axios.get(urlFallback)
          .then((res) => res.data)
          .catch((e) => {
            console.error(e);
          });
      });
  };


  // Not necessary 

  // static forecastDaily = (data) => {
  //   let url = `https://cors-me-first.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast/daily?lat=${data.lat}&lon=${data.lon}&cnt=10&units=metric&APPID=${apiKey}`

  //   return axios.get(url, data)
  //     .then((res) => res.data)
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // };

  // static getCoordinatesFromAddress = (data) => {
  //   let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${data.location}&key=AIzaSyD3gTIY1vymOcudOD7HMcD7Nd8aA-fwz7A`
  //     // let { location } = body;
  //     return axios.get(url)
  //     .then((res) => res.data)
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // };

}
