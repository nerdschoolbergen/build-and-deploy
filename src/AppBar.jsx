/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const PREFIX = 'AppBar';

const classes = {
  root: `${PREFIX}-root`,
  toolbar: `${PREFIX}-toolbar`,
};

const Root = styled('div')((
  {
    theme,
  },
) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.toolbar}`]: {
    justifyContent: 'center',
  },
}));

// This component simply wraps material-ui's AppBar component
function AppBar() {
  return (
    <Root className={classes.root}>
      <MuiAppBar position="static" color="primary">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" color="inherit">
            Movie Posters!
          </Typography>
        </Toolbar>
      </MuiAppBar>
    </Root>
  );
}

export default (AppBar);
