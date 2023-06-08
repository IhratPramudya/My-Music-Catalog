import FavoriteMovieIdb from "../../data/favorite-movie-idb";
import { createMovieItemTemplate } from "../templates/template-creator";

const Like = {
    async render() {
        return `
        <div class="content">
            <h2 class="content__heading">Your Liked Movie</h2>
            <div id="movies" class="movies">
    
            </div>
        </div>
        `
    },

    async afterRender() {
        const movie = await FavoriteMovieIdb.getAllMovie();
        const moviesContainer = document.querySelector('#movies');


        movie.forEach((movie) => {
            moviesContainer.innerHTML += createMovieItemTemplate(movie)
        })
    }
}

export default Like;