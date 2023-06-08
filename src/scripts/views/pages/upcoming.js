import TheMovieDbSource from '../../data/themoviedb-source';
import { createMovieItemTemplate } from '../templates/template-creator';

class Upcoming {
  static async render() {
    return `
              <div class="content">
                <h2 class="content__heading">Upcoming in Chinema</h2>
                <div id="movies" class="movies">
                </div>
              </div>
          `;
  }

  static async afterRender() {
    try {
      const movie = await TheMovieDbSource.upcomingMovies();
      const movieContainer = document.querySelector('#movies');

      movie.forEach((mv) => {
        movieContainer.innerHTML += createMovieItemTemplate(mv);
      });
    } catch (err) {
      alert(err.message);
    }
  }
}

export default Upcoming;
