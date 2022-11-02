import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';

const styles = {
  card: {
    maxWidth: 500,
  },
  media: {
    height: 750,
  },
};

// This component renders the movie poster and some details about the movie
function PosterCard({ classes, posterUrl, movieDetails }) {
  return (
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
}

PosterCard.propTypes = {
  classes: PropTypes.object.isRequired,
  posterUrl: PropTypes.string.isRequired,
  movieDetails: PropTypes.object.isRequired,
};

export default withStyles(styles)(PosterCard);
