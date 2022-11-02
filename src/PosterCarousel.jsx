/* eslint-disable no-console */
import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Fab from '@mui/material/Fab';
import LinearProgress from '@mui/material/LinearProgress';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PosterCard from './PosterCard';
import TheMovieDbApi from './TheMovieDbApi';

const PREFIX = 'PosterCarousel';

const classes = {
  root: `${PREFIX}-root`,
  posterCard: `${PREFIX}-posterCard`,
  nextButton: `${PREFIX}-nextButton`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: theme.spacing(4),
  },

  [`& .${classes.posterCard}`]: {
    display: 'flex',
    justifyContent: 'center',
  },

  [`& .${classes.nextButton}`]: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  }
}));

class PosterCarousel extends Component {
  constructor(props) {
    super(props);

    // The component's initial state
    this.state = {
      isFetchingPopularMovies: true,
      isFetchingConfig: true,
      movies: [],
      currentMovieIndex: 0,
      theMovieDbConfig: null,
      hasError: false,
    };

    // Magic sauce to ensure the "this" context is correct throughout the components lifecycle
    this.showNextPoster = this.showNextPoster.bind(this);
    this.getPopularMovies = this.getPopularMovies.bind(this);
    this.getTheMovieDbConfiguration = this.getTheMovieDbConfiguration.bind(this);
    this.constructPosterUrl = this.constructPosterUrl.bind(this);
  }

  componentDidMount() {
    // This method is called by React when the component mounts the first time

    // We need to get some configuration settings from the API first.
    // We need the config to construct a complete poster url later.
    this.getTheMovieDbConfiguration().then(() => {
      // When we have the config, we can get the movies
      this.getPopularMovies();
    });
  }

  getPopularMovies() {
    return TheMovieDbApi.getPopularMovies()
      .then((json) => {
        // When we get the response body back, we update our state with the data
        this.setState({
          isFetchingPopularMovies: false,
          movies: json.results.slice(2),
          currentMovieIndex: 0,
        });
      })
      .catch((err) => {
        const error = JSON.stringify(err);
        console.error(`An error occurred when attempting to get the most popular movies! ${error}`);

        // Set state indicating we're in a faulted state
        this.setState({
          isFetchingPopularMovies: false,
          hasError: true,
        });
      });
  }

  getTheMovieDbConfiguration() {
    return TheMovieDbApi.getConfiguration()
      .then((json) => {
        // Store the received configuration in state so we can access it later
        this.setState({
          isFetchingConfig: false,
          theMovieDbConfig: json,
        });
      })
      .catch((err) => {
        const error = JSON.stringify(err);
        console.error(`An error occurred when attempting to get config values from the API! ${error}`);

        // Set state indicating we're in a faulted state
        this.setState({
          isFetchingConfig: false,
          hasError: true,
        });
      });
  }

  showNextPoster() {
    const { currentMovieIndex } = this.state;
    this.setState({
      currentMovieIndex: currentMovieIndex + 1,
    });
  }

  constructPosterUrl(posterPath) {
    // The API documentation explains how this url must be constructed:
    // https://developers.themoviedb.org/3/getting-started/images
    const { theMovieDbConfig } = this.state;
    const baseUrl = theMovieDbConfig.images.base_url;
    const posterSize500pxWidth = theMovieDbConfig.images.poster_sizes[4];
    return `${baseUrl}${posterSize500pxWidth}${posterPath}`;
  }

  render() {
    // This method is called by React on every render.
    // It will be called every time this.props or this.state changes

    // Destruct props and state so we can use it less verbosely
    const { } = this.props;
    const {
      isFetchingPopularMovies,
      isFetchingConfig,
      currentMovieIndex,
      movies,
      hasError,
    } = this.state;

    // Show progress bar if we're fetching any data
    if (isFetchingPopularMovies || isFetchingConfig) {
      return <LinearProgress />;
    }

    // Show error message if anything failed
    if (hasError) {
      return <h1>An error occurred. SAD!</h1>;
    }

    const currentMovie = movies[currentMovieIndex];
    const isLastMovieInList = currentMovieIndex + 1 === movies.length;
    const posterUrl = this.constructPosterUrl(currentMovie.poster_path);

    return (
      <Root className={classes.root}>
        <div className={classes.posterCard}>
          <PosterCard posterUrl={posterUrl} movieDetails={currentMovie} />
        </div>
        <div className={classes.nextButton}>
          <Fab
            color="primary"
            onClick={this.showNextPoster}
            disabled={isLastMovieInList}
          >
            <NavigateNextIcon />
          </Fab>
        </div>
      </Root>
    );
  }
}

PosterCarousel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default (PosterCarousel);
