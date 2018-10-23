import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';

// Utility
import moment from 'moment';
// Custom assets 
// import placeholderImage from '../../img/placeholder-image.jpeg'
// Stylization 
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Switch from '@material-ui/core/Switch';

import '../../css/current.css';

import Icon from '@mdi/react';
import {
  mdiTemperatureCelsius,
  mdiTemperatureFahrenheit,
  mdiThermometerLines,
  mdiInformationVariant,
  mdiWeatherWindy,
  mdiWaterPercent
} from '@mdi/js';

const styles = {
  paperCustom: {
    backgroundColor: "transparent"
  },
  textPrimary: {
    color: "#efefef"
  },
  avatar: {
    margin: 2,
    backgroundColor:"#800080",
    border: "1px solid #7d0d78",
  },
  card: {
    minWidth: 300,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};


export class Current extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentWeather: [],
      toggleTime: true,
      safe: false,
      date: moment().format('ll'),
      toggleTemp: true,
      temperatureUnit:  "loading...",
      temperatureCurrent: "",
      humidity: "",
      humidityUnit: "loading...",
      windSpeed: "",
      windSpeedUnit: "loading...",
    };
  }

  static getDerivedStateFromProps = (nextProps, prevState)  => {
    if (prevState.currentWeather != nextProps.weather) {
      return {
        currentWeather: nextProps.weather
      }
    } 
    return null;
  }

  componentDidMount = () => {
    let timeOfDay = moment().format("HH:mm");
    if (timeOfDay > "05:00" && timeOfDay < "20:00") {
      this.setState({
        toggleTime: true,
      });
    } else {
      this.setState({
        toggleTime: false, 
      });
    }
    this.preSetData();  
  }

  preSetData = () => {
    setTimeout(() => {
      this.setData();  
    }, 100);
  } 

  setData = () => {
    if (this.state.currentWeather.main === undefined) {
      this.preSetData();
      return
    }
    this.setState({
      temperatureCurrent: this.state.currentWeather.main.temp.toFixed(),
      temperatureUnit: " °C",
      humidity: this.state.currentWeather.main.humidity.toString(),
      humidityUnit: " %",
      windSpeed: this.state.currentWeather.wind.speed.toString(),
      windSpeedUnit: " m/s"
    });
  }

  toggleTimeOfDay = () => {
    this.setState({
      toggleTime: !this.state.toggleTime,
    });
  }


  toggleTemperature = () => {
    this.setState({
      toggleTemp: !this.state.toggleTemp,
    }, () => {
      if (!this.state.toggleTemp) {
        this.setState({
          temperatureUnit: " °F",
          temperatureCurrent: (9/5*this.state.temperatureCurrent+32).toFixed(),
        });
      } else if (this.state.toggleTemp) {
        this.setState({
          temperatureUnit: " °C",
          temperatureCurrent: ((this.state.temperatureCurrent-32)*5/9).toFixed(),
        });
      }
    });
  }


  render() {
    const { toggleTemp, date, currentWeather, temperatureUnit, windSpeedUnit, humidityUnit,  temperatureCurrent, windSpeed, humidity} = this.state;
    const { classes } = this.props;
    
    return (  
      <div className="currentContainer">
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className="current-weather"
        >
        {currentWeather.main &&
          <Paper className={classes.paperCustom}>
            <Card className={classes.paperCustom}>
              <CardContent style={{minWidth: 270.156}}>
                <Grid container justify="space-between" spacing={24}>
                  <Grid item xs={9}>
                    <Typography className={classes.textPrimary} variant="h5" component="h3">
                      Location:&nbsp;
                      {currentWeather.name}
                    </Typography>
                    <Typography color="textSecondary">
                      Date: {date}
                    </Typography>
                    <Typography color="textSecondary">
                      Currently it's {currentWeather.weather && currentWeather.weather[0].description}.
                    </Typography>
                  </Grid>
                  <Grid item xs={3} style={{display: "flex", justifyContent: "center"}}>
                    <Avatar 
                      className={classes.avatar}
                      onClick={this.toggleTemperature}
                    >
                      <Button>
                        {toggleTemp ? 
                          <Icon 
                            path={mdiTemperatureCelsius}
                            size={1}
                            color="#fff"
                          />
                          : 
                          <Icon 
                            path={mdiTemperatureFahrenheit}
                            size={1}
                            color="#fff"
                          />
                        }
                      </Button>   
                    </Avatar>  
                  </Grid>
                </Grid>

                <Grid container spacing={16} >
                  <Grid item  xs={12}>
                    <ListItem disableGutters>
                      <Avatar
                        style={{backgroundColor:"#6d158f"}}
                      >
                        <Icon 
                          path={mdiThermometerLines}
                          size={1}
                          color="#fff"
                        />
                      </Avatar>
                      <ListItemText primary="Current Temperature" secondary={temperatureCurrent + temperatureUnit} />
                    </ListItem>
                    <ListItem disableGutters>
                      <Avatar
                        style={{backgroundColor:"#6d158f"}}
                      >
                        <Icon 
                          path={mdiWeatherWindy}
                          size={1}
                          color="#fff"
                        />
                      </Avatar>
                      <ListItemText 
                        primary="Wind Speed" 
                        secondary={windSpeed + windSpeedUnit } 
                      />
                    </ListItem>

                    <ListItem disableGutters>
                      <Avatar
                        style={{backgroundColor:"#6d158f"}}
                      >
                        <Icon 
                          path={mdiWaterPercent}
                          size={1}
                          color="#fff"
                        />
                      </Avatar>
                        <ListItemText 
                          primary="Humidity" 
                          secondary={humidity + humidityUnit }
                        /> 
                    </ListItem>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        }
        </Grid>
      </div>
      
    );
  }
}

export default withStyles(styles)(Current)