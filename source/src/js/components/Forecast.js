import React, { Component } from "react";
import ReactDOM from "react-dom";

// utility
import { Brush, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import moment from 'moment';

//stylization 
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import '../../css/forecast.css';

const styles = {
  chartContainer: {
    maxWidth: '100vw',
    maxHeight: 300,
    width: 150,
    height: 150,
  }
};

export class CustomizedAxisTick extends React.Component {
  render () {
    const {x, y, stroke, payload, timeAndDateFormated, hoursFormated} = this.props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={8} y={0} dy={10} style={{fontSize: 10}} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value.substring(0,5)}</text>
        <text x={10} y={15} dy={8} style={{fontSize: 10}} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value.substring(9,payload.value.length)}</text>
      </g>
    );
  }
};


export class CustomTooltip extends React.Component {

  render() {
    if (!this.props) {
      // Did not received props
      return
    }
    const { active } = this.props;
    if (active) {
      const { payload, label } = this.props;
      const info = payload[0].payload;
      
      return (
        <div className="custom-tooltip">
          <p className="desc">
            <span>
              Temperature: 
            </span>
            &nbsp;
            {info.temp}°C
          </p>
          <p className="desc">
            <span>
              Date: 
            </span>
            &nbsp;
            {info.dateFormated}
          </p>
          <p className="desc">
            <span>
              Time: 
            </span>
            &nbsp;
            {info.hoursFormated}
          </p>
        </div>
      );
    }

    return null;
  }
};

export class Forecast extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      forecast: [],
    };
  }

  static getDerivedStateFromProps = (nextProps, prevState)  => {
    if (prevState.forecast != nextProps.forecast) {
      return {
        forecast: nextProps.forecast,
      };
    } 
    return null;
  }

  componentDidMount = () => {
    // console.warn("Forecast.js");
    
    // setTimeout(() => {
      this.setData();  
      // console.log("this.state:", this.state);
    // }, 650);
  }

  setData = () => {
      let list = this.state.forecast.list
      let info = list.map((item, i) => {
        // moment.unix because the UTC time stamp is from a UNIX system
        let date = new Date(item.dt*1000);
        let main = item.main;
        let rain = item.rain;
        let timeUTC = item.dt;
        let dateFormated = moment.unix(item.dt).format("DD MMM")
        let hoursFormated = moment.unix(item.dt).format("HH:mm") + "h"
        let timeAndDateFormated = `${hoursFormated} - ${dateFormated}`
        return ({...main, rain, timeUTC, dateFormated, hoursFormated, timeAndDateFormated})
      })

      let timeAndDate = list.map((item, i) => {
        let dateFormated = moment.unix(item.dt).format("DD MMM");
        let hoursFormated = moment.unix(item.dt).format("HH:mm") + "h";
        let timeAndDateFormated = {"hours": hoursFormated, "date":dateFormated};
        return (timeAndDateFormated);
      })

      this.setState({
        temperatures: info,
        timeAndDateFormated: timeAndDate
      });
  }


  render() {
    const props = this.props;
    const { temperatures } = this.state;
    const { classes } = this.props;

    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
      {temperatures &&
       	<Paper style={{marginTop: 70}}>
          <div style={{width: '90vw', height: 200, textAlign: 'center'}}>
          <div style={{marginTop: 5, color: "#666"}}>Temperatures in celsius</div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart width={600} height={400} data={temperatures} margin={{top: 5, right: 50, left: -10, bottom: 20}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="timeAndDateFormated" 
                  height={60} 
                  tick={<CustomizedAxisTick/>}
                />
                <YAxis/>
                <Brush 
                  dataKey='dateFormated' 
                  height={15}
                  y={150}
                  stroke="#8884d8"
                />
                <Tooltip 
                  content={<CustomTooltip/>}
                />
                <Area
                  type='monotone'
                  dataKey='temp'
                  stackId="1"
                  stroke='#8a007a'
                  fillOpacity={1}
                  fill='#8a007ac4' 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Paper>
      }

      {temperatures &&
        <Paper style={{marginTop: 10}}>
          <div style={{width: '90vw', height: 200, textAlign: 'center'}}>
            <div style={{marginTop: 5, color: "#666"}}>Precipitation in mm</div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart width={600} height={400} data={temperatures} margin={{top: 5, right: 50, left: -10, bottom: 20}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis
                  dataKey="timeAndDateFormated"
                  height={60}
                  tick={<CustomizedAxisTick/>}
                  />
                <YAxis/>
                <Brush 
                  dataKey='dateFormated' 
                  height={15}
                  y={150}
                  stroke="#8884d8"
                />
                <Area
                  type='monotone'
                  dataKey='rain.3h'
                  stackId="1"
                  stroke='#005eff'
                  fillOpacity={1}
                  fill='#005effc4' 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Paper>
      }
      </Grid>
    );
  }
}

export default withStyles(styles)(Forecast)
