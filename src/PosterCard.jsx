import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';

const PREFIX = 'PosterCard';

const classes = {
  card: `${PREFIX}-card`,
  media: `${PREFIX}-media`,
};

const Root = styled('div')({
  [`& .${classes.card}`]: {
    maxWidth: 500,
  },
  [`& .${classes.media}`]: {
    height: 750,
  },
});

// This component renders the movie poster and some details about the movie
function PosterCard({ posterUrl, movieDetails }) {
  return (
    <Root>
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
    </Root>
  );
}

PosterCard.propTypes = {
  posterUrl: PropTypes.string.isRequired,
  movieDetails: PropTypes.shape({
    title: PropTypes.string,
    overview: PropTypes.string,
  }).isRequired,
};

export default (PosterCard);
