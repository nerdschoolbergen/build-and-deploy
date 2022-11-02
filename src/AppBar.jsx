/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },
  toolbar: {
    justifyContent: 'center',
  },
});

// This component simply wraps material-ui's AppBar component
function AppBar({ classes }) {
  return (
    <div className={classes.root}>
      <MuiAppBar position="static" color="primary">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit">
            Movie Posters!
          </Typography>
        </Toolbar>
      </MuiAppBar>
    </div>
  );
}

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppBar);
