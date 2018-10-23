import React, { Component } from "react";
import ReactDOM from "react-dom";
import { UserApi } from '../service/services';

//components
import Current from './Current.js';
import Forecast from './Forecast.js';
import Search from './Search.js';
import CircularDeterminate from './CircularDeterminate.js';

//stylization 
import { withStyles } from '@material-ui/core/styles';
import { createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Badge from '@material-ui/core/Badge';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

import '../../css/style.css';


const styles = theme => ({
  customSnackBar: {
    width: "100%",
    background: "linear-gradient(#d9415c, #5c0080)",
  },
  customSnackBarInner: {
    background: "transparent",
    boxShadow: "none"
  }
});

const CustomSnackBar = withStyles({
  root: {
    background: "linear-gradient(#d9415c, #5c0080)",
  },
})(Snackbar);

function TabContainer(props) {
  return (
    <Typography 
      component="div" 
      >
      {props.children}
    </Typography>
  );
}

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  }
});

export class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      coords: [],
      value: 0,
      location: "Current",
      weather: [],
      forecast: [],
      open: true,
      geoSupport: false,
      loading: false,
      clearCheck: 0,
      searchedLocation: "",
      openSnackbar: false,
      Transition: TransitionUp,
      messageContent: "Loading",
    };
  }

  componentDidMount = () => {
    let location = window.localStorage.getItem("location");
    if (location) {
      this.setState({
        geoSupport: true,
        searchedLocation: window.localStorage.getItem("location"),
      });
      this.searchFor(location);
      this.searchForecast(location);
    }
  }

  navigatorPreCheck = () => {
    // console.warn("navigatorPreCheck");
    if (window.localStorage.getItem("location")) {
      return
    }

    navigator.geolocation.getCurrentPosition(this.checkWeather);
    navigator.geolocation.getCurrentPosition(this.checkForecast);

    if (!navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.checkWeather);
      navigator.geolocation.getCurrentPosition(this.checkForecast);
      // console.log("navigator FALSE");
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.checkWeather);
      navigator.geolocation.getCurrentPosition(this.checkForecast);
      // console.log("navigator TRUE");
    }    

    navigator.geolocation.getCurrentPosition(prompted => {
      navigator.permissions.query({name:'geolocation'}).then(permissionStatus => {
        if (permissionStatus.state == 'prompt') {
          navigator.geolocation.getCurrentPosition(this.checkWeather);
          navigator.geolocation.getCurrentPosition(this.checkForecast);
          permissionStatus.onchange = (permissionStatusChanged) => {
            // console.warn("permissionStatusChanged:", permissionStatusChanged);
          };
        } else if (permissionStatus.state == 'granted') {
          // console.warn("granted:", permissionStatus.state);
          
          navigator.geolocation.getCurrentPosition(this.checkWeather);
          navigator.geolocation.getCurrentPosition(this.checkForecast);
          this.setState({
            open: false,
            loading: true,
            geoSupport: true,
            messageContent: "Loading the weather based on your GPS.",
            openSnackbar: true,
          });
        } else if (permissionStatus.state == 'denied') {
          // console.warn("denied:", permissionStatus.state);
          this.permissionDenied()
        } else {
          navigator.geolocation.getCurrentPosition(this.checkWeather);
          navigator.geolocation.getCurrentPosition(this.checkForecast);
        }
      })
    })
  }

  permissionDenied = () => {
    this.setState({
      loading: true,
      messageContent: "Loading the weather based on your IP address.",
      openSnackbar: true,
    }, () => {
      this.checkIpDb();
    });
  }

  checkIpDb = async () => {
    this.setState({
      loading: true,
      geoSupport: true,
    });

    try {
      let res = await UserApi.ipDbAddress();
      if (res.error) {
        console.error(res.error);
        this.setState({
          loading: true,
        });
        return;
      } else {
        let lat = parseFloat(res.latitude);
        let lon = parseFloat(res.longitude);
        let position = { coords : {"latitude": lat, "longitude" : lon}};
        this.checkWeather(position)
        this.checkForecast(position)
        this.setState({
          open: false,
        });
      }
    } catch(e) {
      console.error(e);
      return;
    }
  }

  // No need for this feature for now
  // getCoordsFromAddress = async (location)  => {
  //   this.setState({
  //     value: 0,
  //     current: location,
  //   });
  //   return;
  //   try {
  //     let res = await UserApi.getCoordinatesFromAddress({
  //       location: location
  //     });
  //     if (res.error) {
  //       console.error(res.error);
  //       this.setState({
  //         loading: true,
  //       });
  //       return;
  //     } else {
  //       console.log("getCoordsFromAddress", res);
  //     }
  //   } catch(e) {
  //     console.error(e);
  //     return;
  //   }
  // }

  checkWeather = async (position) => {
    try {
      let res = await UserApi.weather({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
      if (res.error) {
        console.error(res.error);
        this.setState({
          loading: true,
        });
        return;
      } else {
        this.setState({
          weather: res,
          geoSupport: true,
          loading: false,
        }); 
      }
    } catch(e) {
      console.error(e);
      return;
    }
  }

  checkForecastDaily = async (position) => {
    try {
      let res = await UserApi.forecastDaily({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
      if (res.error) {
        console.error(res.error);
        this.setState({
          loading: true,
        });
        return;
      } else {
        this.setState({
          currentWeather: res,
          geoSupport: true,
          loading: false,
        }); 
      }
    } catch(e) {
      console.error(e);
      return;
    }
  }

  checkForecast = async (position) => {
    try {
      let res = await UserApi.forecast({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        units: "metric",
      });
      if (res.error) {
        console.error(res.error);
        this.setState({
          loading: true,
        });
        return;
      } else {
        this.setState({
          forecast: res,
          loading: false,
        }); 
      }
    } catch(e) {
      console.error(e);
      return;
    }
  }

  searchFor = async (location) => {
    window.localStorage.setItem("location", location)
    this.setState({
      loading: true
    });
    try {
      let res = await UserApi.searchForWeather({
        location: location,
      });
      if (res.error) {
        console.error(res.error);
        return;
      } else {
        this.setState({
          weather: res,
          value: 0,
          loading: false,
          current: location,
          searchedLocation: location
        }); 
      }
    } catch(e) {
      window.localStorage.removeItem("location");
      this.setState({
        messageContent: "Location not found",
        openSnackbar: true,
        loading: false,
        searchedLocation: "",
      });
      console.error(e);
      return;
    }
  }

  searchForecast = async (location) => {
    this.setState({
      loading: true
    });
    try {
      let res = await UserApi.searchForForecast({
        location: location,
      });
      if (res.error) {
        console.error(res.error);
        return;
      } else {
        this.setState({
          forecast: res,
          loading: false,
        }); 
      }
    } catch(e) {
      console.error(e);
      return;
    }
  }

  handleTabChange = (event, value) => {
    let loading = false
    if (this.state.loading === true) {
      return;
    } else {
      this.setState({value});
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleOpenSnackbar = Transition => (message) => {
    this.setState({ 
      openSnackbar: true, Transition 
    });
  }

  handleCloseSnackbar = () => {
    this.setState({ openSnackbar: false });
  }

  clearSearch = () => {
    this.setState({
      searchedLocation: null 
    });
    window.localStorage.removeItem("location");
  } 

  render() {
    const { geoSupport, loading, location, value, messageContent } = this.state;
    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <div className="appContainer">
          {!geoSupport &&
            <Dialog
              open={this.state.open}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Permission to use your GPS location?"}</DialogTitle>
              <DialogActions>
                <Button onClick={this.permissionDenied} color="primary">
                  Denied
                </Button>
                <Button onClick={this.navigatorPreCheck} color="primary" autoFocus>
                  Granted
                </Button>
              </DialogActions>
            </Dialog>
          }

          {loading  &&
            <span>
              <CircularDeterminate/>

            </span>
          }

          {geoSupport &&
            <div>
              <AppBar position="absolute">
                <Tabs value={value} onChange={this.handleTabChange} fullWidth>
                  <Tab label={location}  className="" style={{backgroundColor: "purple"}}/>
                  <Tab label="Forecast" className=""  style={{backgroundColor: "purple"}}/>
                  {
                    window.localStorage.getItem("location") ? 
                    <Tab
                      style={{backgroundColor: "purple"}} 
                      label={
                          <span style={{fontSize: "0.875rem"}}>Search
                            <div onClick={e => this.clearSearch()} className="custom-badge">X</div>
                          </span>
                      }
                    />
                    : 
                    <Tab 
                      label="Search" 
                      style={{backgroundColor: "purple"}} 
                    />
                  }
                </Tabs>
              </AppBar>
              {value === 0 &&
                <TabContainer>
                  <Current 
                    weather={this.state.weather && this.state.weather}
                  />

                </TabContainer>
              }
              {value === 1 &&
                <TabContainer>
                  <Forecast 
                    forecast={this.state.forecast && this.state.forecast}
                  />
                </TabContainer>
              }
              {value === 2 &&
                <TabContainer>
                  <Search 
                    searchFor={this.searchFor} 
                    searchForecast={this.searchForecast}
                    loading={this.state.loading}
                    searchedLocation={this.state.searchedLocation}
                  />
                </TabContainer>
              }
            </div>
          }


        </div>
        <Snackbar
          open={this.state.openSnackbar}
          onClose={this.handleCloseSnackbar}
          TransitionComponent={this.state.Transition}
          className={classes.customSnackBar}
          ContentProps={{
            className: classes.customSnackBarInner,
            'aria-describedby': 'message-id',
            headlineMapping: {
              body1: "div",
              body2: "div"
            }
          }} 
          autoHideDuration={2000}
          message={<span id="message-id">{messageContent}</span>}
        />
      </MuiThemeProvider>

    );
  }
}

export default withStyles(styles)(App)
