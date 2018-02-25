import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import AppBar from "./AppBar";

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

const Layout = ({ classes, children }) => {
  return (
    <div className={classes.root}>
      <AppBar />
      {children}
    </div>
  );
};

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

export default withStyles(styles)(Layout);
