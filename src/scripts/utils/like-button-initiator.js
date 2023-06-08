import FavoriteMovieIdb from "../data/favorite-movie-idb";
import { createLikeButtonTemplate, createLikedButtonTemplate } from "../views/templates/template-creator";

const LikeButtonInitiator = {
  async init({ likeButtonContainer, movie }) {
    console.log(likeButtonContainer);
    console.log(movie);
    this._likeButtonContainer = likeButtonContainer;
    this._movie = movie;
    await this._renderButton()
  },

  async _renderButton() {
    const { id } = this._movie;

    if(await this.isMovieExist(id)) {
      this._renderLiked();
    } else {
      this._renderLike();
    }
  },

  async isMovieExist(id) {
    const movie = await FavoriteMovieIdb.getMovie(id);
    return !!movie
  },

  _renderLike() {
      this._likeButtonContainer.innerHTML = createLikeButtonTemplate();

      const likeButton = document.querySelector('#likeButton');
      likeButton.addEventListener('click', async() => {
        await FavoriteMovieIdb.putmovie(this._movie);
        await this._renderButton();
      })
  },

  _renderLiked() {
      this._likeButtonContainer.innerHTML = createLikedButtonTemplate();

      const likeButton = document.querySelector('#likeButton');
      likeButton.addEventListener('click', async() => {
        await FavoriteMovieIdb.deleteMovie(this._movie.id);
        await this._renderButton();
      })
  }
};

export default LikeButtonInitiator;
