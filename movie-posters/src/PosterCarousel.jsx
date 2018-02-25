import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import { LinearProgress } from "material-ui/Progress";
import NavigateNextIcon from "material-ui-icons/NavigateNext";
import PosterCard from "./PosterCard";
import TheMovieDbApi from "./TheMovieDbApi";

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  posterCard: {
    display: "flex",
    justifyContent: "center"
  },
  nextButton: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing.unit * 2
  }
});

class PosterCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetchingPopularMovies: true,
      movies: [],
      currentMovieIndex: 0,
      theMovieDbConfig: null
    };

    this.showNextPoster = this.showNextPoster.bind(this);
    this.getPopularMovies = this.getPopularMovies.bind(this);
    this.getTheMovieDbConfiguration = this.getTheMovieDbConfiguration.bind(
      this
    );
    this.constructPosterUrl = this.constructPosterUrl.bind(this);
  }

  componentDidMount() {
    this.getTheMovieDbConfiguration().then(() => {
      this.getPopularMovies();
    });
  }

  getPopularMovies() {
    return TheMovieDbApi.getPopularMovies()
      .then(json => {
        this.setState({
          isFetchingPopularMovies: false,
          movies: json.results,
          currentMovieIndex: 0
        });
      })
      .catch(err => {
        this.setState({ isFetchingPopularMovies: false });
      });
  }

  getTheMovieDbConfiguration() {
    return TheMovieDbApi.getConfiguration().then(json => {
      this.setState({
        theMovieDbConfig: json
      });
    });
  }

  showNextPoster() {
    this.setState({
      currentMovieIndex: this.state.currentMovieIndex + 1
    });
  }

  constructPosterUrl(posterPath) {
    const baseUrl = this.state.theMovieDbConfig.images.base_url;
    const posterSize = this.state.theMovieDbConfig.images.poster_sizes[4]; // 500px width
    return `${baseUrl}${posterSize}${posterPath}`;
  }

  render() {
    const { classes } = this.props;
    const { isFetchingPopularMovies, currentMovieIndex, movies } = this.state;

    const currentMovie = movies[currentMovieIndex];
    const isLastMovie = currentMovieIndex + 1 === movies.length;

    if (isFetchingPopularMovies) {
      return <LinearProgress />;
    }

    const posterUrl = this.constructPosterUrl(currentMovie.poster_path);

    return (
      <div className={classes.root}>
        <div className={classes.posterCard}>
          <PosterCard posterUrl={posterUrl} movieDetails={currentMovie} />
        </div>
        <div className={classes.nextButton}>
          <Button
            variant="fab"
            color="primary"
            onClick={this.showNextPoster}
            disabled={isLastMovie}
          >
            <NavigateNextIcon />
          </Button>
        </div>
      </div>
    );
  }
}

PosterCarousel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PosterCarousel);
