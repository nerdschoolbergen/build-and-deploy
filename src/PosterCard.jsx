import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    maxWidth: 500,
  },
  media: {
    height: 750,
  },
};

// This component renders the movie poster and some details about the movie
const PosterCard = ({ classes, posterUrl, movieDetails }) => (
  <div>
    <Card className={classes.card}>
      <CardMedia className={classes.media} image={posterUrl} title={movieDetails.title} />
      <CardContent>
        <Typography variant="h5" component="h2">
          {movieDetails.title}
        </Typography>
        <Typography component="p">{movieDetails.overview}</Typography>
      </CardContent>
      <CardActions>
        {/* TODO */}
      </CardActions>
    </Card>
  </div>
);

PosterCard.propTypes = {
  classes: PropTypes.object.isRequired,
  posterUrl: PropTypes.string.isRequired,
  movieDetails: PropTypes.object.isRequired,
};

export default withStyles(styles)(PosterCard);
