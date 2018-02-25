import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Layout from "./Layout";
import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

const App = ({ classes }) => {
  return (
    <Layout>
      <Paper className={classes.paper}>xs=12</Paper>{" "}
    </Layout>
  );
};

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
