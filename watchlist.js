const movieListEl = document.getElementById("content");
const nothingHereYetEl = document.getElementById("watchlist-empty-container");
let movieArray = getLocalStorage();

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("watchlist"));
}

function setLocalStorage() {
  return localStorage.setItem("watchlist", JSON.stringify(movieArray));
}

document.addEventListener("click", (e) => {
  if (e.target.dataset.watchlist) {
    movieArray = movieArray.filter((movie) => {
      if (movie.imdbID !== e.target.dataset.watchlist) {
        return movie;
      }
    });

    getLocalStorage();
    render();
    setLocalStorage();
  }
});

function render() {
  movieListEl.innerHTML = ``;
  if (movieArray.length) {
    nothingHereYetEl.classList.add("hide-content");
    setMovieListHtml(movieArray);
  } else if (movieArray.length === 0) {
    nothingHereYetEl.classList.remove("hide-content");
  }
}

function setMovieListHtml(movieArray) {
  movieArray.map((movie) => {
    const { Title, Runtime, Genre, Plot, Poster, imdbRating, imdbID } = movie;
    movieListEl.innerHTML += `
                          <div class="movie-result-container">
                            <img class="movie-result-poster" src=${Poster} onerror="this.src='./no-poster.png'" "alt="the movie poster"/>
                            <div class="movie-result-info-container">
                              <div class="movie-result-header">
                                <h4 class="movie-result-title">${Title}</h4>
                                <img class="movie-result-star" src="./star.png" />
                                <p class="movie-result-rating">${imdbRating}</p>
                              </div>
                              <div class="movie-result-details">
                                <p class="movie-result-length">${Runtime}</p>
                                <p class="movie-result-genre">${Genre}</p>
                                <div class="movie-result-watchlist-add remove" data-watchlist=${imdbID}>
                                  <img class="movie-result-watchlist-add-icon" src="./remove.png" />
                                  <p>Remove</p>
                                </div>
                              </div>
                              <p class="movie-result-synopsis">${Plot}</p>
                            </div>
                          </div>`;
  });
}

render();
