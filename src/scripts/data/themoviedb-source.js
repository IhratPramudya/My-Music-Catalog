import API_ENDPOINT from '../globals/api-endpoint';

class TheMovieDbSource {
  static nowPlayingMovies() {
    return fetch(API_ENDPOINT.NOW_PLAYING)
      .then((res) => res.json())
      .then((res) => res.results)
      .catch(((err) => err));
  }

  static upcomingMovies() {
    return fetch(API_ENDPOINT.UPCOMING)
      .then((res) => res.json())
      .then((res) => res.results)
      .catch((err) => err);
  }

  static detailMovie(id) {
    return fetch(API_ENDPOINT.DETAIL(id))
      .then((res) => res.json())
      .catch((err) => err);
  }
}

export default TheMovieDbSource;
