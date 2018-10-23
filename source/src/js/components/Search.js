import React, { Component } from "react";
import ReactDOM from "react-dom";

//stylization 
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CircularDeterminate from './CircularDeterminate.js';
import Input from '@material-ui/core/Input';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import '../../css/search.css';


const styles = {
  textField: {
    color: "#ccc",
    '&:hover': {
      color: '#ffffffe6',
    },
  },
  cssLabel: {
    color: "#ccc",
    '&$cssFocused': {
      color: "#ffffffe6",
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:hover:before': {
      borderBottom: "1px solid #ccc !important",
    },
    '&:before': {
      borderBottomColor: "#ccc",
    },
    '&:after': {
      borderBottomColor: "#ffffffe6",
    },
  },
};

// Can also work as class, however, not necessary here
export class Search extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      // searchedLocation: window.localStorage.getItem('location')
      searchedLocation: this.props.searchedLocation
    };
  }

  handleOnChange = (e) => {
    this.setState({
      searchedLocation: e.target.value
    });
  }

  callGeocoder = (e) => {
     if (e.keyCode == 13) {
      if (this.state.searchedLocation.localeCompare("Beograd") == 0) {
        this.setState({
          searchedLocation: "Belgrade" 
        }, () => {
          this.props.searchFor(this.state.searchedLocation)
          this.props.searchForecast(this.state.searchedLocation)
        });
      } else {
      this.props.searchFor(this.state.searchedLocation)
      this.props.searchForecast(this.state.searchedLocation)
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.searchedLocation != nextProps.searchedLocation) {
      return {
        searchedLocation: nextProps.searchedLocation
      }
    }
    return false
  }

  render() {
    const {props, loading, classes} = this.props;
    const {searchedLocation} = this.state;
    
    return (
      <Grid
        container
        // direction="row"
        justify="center"
        alignItems="center"
        className="search"
        direction="column"
      > 

        {loading  &&
          <CircularDeterminate/>
        }

        {!loading  &&
          <FormControl className={classes.margin}>
            <InputLabel
              htmlFor="custom-css-input"
              FormLabelClasses={{
                root: classes.cssLabel,
                focused: classes.cssFocused,
              }}
            >
              Search for a City
            </InputLabel>
            <Input
              id="custom-css-input"
              className={classes.textField}
              classes={{
                underline: classes.cssUnderline,
              }}
              onChange={e => this.handleOnChange(e)}
              onKeyDown={e => this.callGeocoder(e)}
              defaultValue={searchedLocation}
            />
          </FormControl>
        }
      </Grid>
    );
  }
}

export default withStyles(styles)(Search)
