import TheMovieDbSource from '../../data/themoviedb-source';
import { createMovieItemTemplate } from '../templates/template-creator';

class NowPlaying {
  static async render() {
    return `
              <div class="content">
                  <h2 class="content__heading">Now Playing</h2>
                  <div id="movies" class="movies">
                  </div>
              </div>
          `;
  }

  static async afterRender() {
    // Fungsi ini akan di panggil setelah render halaman
    const movieContainer = document.getElementById('movies');
    try {
      const movie = await TheMovieDbSource.nowPlayingMovies();
      movie.forEach((mv) => {
        movieContainer.innerHTML += createMovieItemTemplate(mv);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default NowPlaying;
