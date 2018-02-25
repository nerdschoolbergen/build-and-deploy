import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Grid from "material-ui/Grid";
import AppBar from "./AppBar";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    marginBottom: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  }
});

const Layout = ({ classes, children }) => {
  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} />
      {children}
      {/* <Grid container spacing={24} justify="center">
        <Grid item xl={6} lg={8} md={10} sm={12} xs={12}>
          
        </Grid>
      </Grid> */}
    </div>
  );
};

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

export default withStyles(styles)(Layout);
