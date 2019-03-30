import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing.unit * 2,
  },
  toolbar: {
    justifyContent: 'center',
  },
});

// This component simply wraps material-ui's AppBar component
const AppBar = ({ classes }) => (
  <div className={classes.root}>
    <MuiAppBar position="static" color="primary">
      <Toolbar className={classes.toolbar}>
        <Typography variant="title" color="inherit">
          Movie Posters!
        </Typography>
      </Toolbar>
    </MuiAppBar>
  </div>
);

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppBar);
