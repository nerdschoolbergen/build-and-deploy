import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import { LinearProgress } from "material-ui/Progress";
import PosterCard from "./PosterCard";

const styles = () => ({});

class PosterCarousel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetchingPopularMovies: true,
      movies: [],
      currentMovieIndex: 0
    };

    this.showNextPoster = this.showNextPoster.bind(this);
  }

  componentDidMount() {
    const apiKey = "0e7601740ef116eda5e9b83993959d45";
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    };

    fetch(url, options)
      .then(response => response.json())
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

  showNextPoster() {
    this.setState({
      currentMovieIndex: this.state.currentMovieIndex + 1
    });
  }

  render() {
    const { isFetchingPopularMovies, currentMovieIndex, movies } = this.state;
    const currentMovie = movies[currentMovieIndex];
    const isLastMovie = currentMovieIndex + 1 === movies.length;

    if (isFetchingPopularMovies) {
      return <LinearProgress />;
    }

    return (
      <div>
        <PosterCard
          posterUrl={currentMovie.poster_path}
          movieDetails={currentMovie}
        />
        <div>
          <Button onClick={this.showNextPoster} disabled={isLastMovie}>
            Next
          </Button>
        </div>
      </div>
    );
  }
}

PosterCarousel.propTypes = {
  posterUrl: PropTypes.string.isRequired,
  movieDetails: PropTypes.object.isRequired,
  onGetNextPoster: PropTypes.func.isRequired
};

export default withStyles(styles)(PosterCarousel);
