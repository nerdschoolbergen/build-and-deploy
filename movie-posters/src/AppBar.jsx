import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing.unit * 2
  },
  toolbar: {
    justifyContent: "center"
  }
});

const SimpleAppBar = ({ classes }) => (
  <div className={classes.root}>
    <AppBar position="static" color="primary">
      <Toolbar className={classes.toolbar}>
        <Typography variant="title" color="inherit">
          Movie Posters!
        </Typography>
      </Toolbar>
    </AppBar>
  </div>
);

SimpleAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleAppBar);
