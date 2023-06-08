import TheMovieDbSource from '../../data/themoviedb-source';
import UrlParser from '../../routes/url-parser';
import LikeButtonInitiator from '../../utils/like-button-initiator';
import { createMovieDetailTemplate } from '../templates/template-creator';

class Detail {
  static async render() {
    return `
                <div id="movie" class="movie"></div>
                <div id="likeButtonContainer"></div>
            `;
  }

  static async afterRender() {
      const url = UrlParser.parseActiveUrlWithoutCombiner();
      const detaiMovie = await TheMovieDbSource.detailMovie(url.id);
      const detailContainer = document.querySelector('#movie');

      detailContainer.innerHTML = createMovieDetailTemplate(detaiMovie);
      LikeButtonInitiator.init({
        likeButtonContainer: document.querySelector('#likeButtonContainer'), 
        movie: {
          id: detaiMovie.id,
          title: detaiMovie.title,
          overview: detaiMovie.overview,
          backdrop_path: detaiMovie.backdrop_path,
          vote_average: detaiMovie.vote_average,
        }
      })
  }
}

export default Detail;
