const apiKey = '0e7601740ef116eda5e9b83993959d45';

const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
};

class TheMovieDbApi {
  static getConfiguration() {
    const url = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
    return fetch(url, options).then((response) => response.json());
  }

  static getPopularMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
    return fetch(url, options).then((response) => response.json());
  }
}

export default TheMovieDbApi;
