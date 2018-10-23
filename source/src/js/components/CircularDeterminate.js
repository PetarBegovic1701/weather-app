import React, { Component } from "react";
import ReactDOM from "react-dom";
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = theme => ({
  progress: {
    margin: 3 * 2,
    color: "#6b037c"
  },
});

class CircularDeterminate extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <CircularProgress
          className={classes.progress}
          size={50}
        />
    
      </div>
    );
  }
}

export default withStyles(styles)(CircularDeterminate);