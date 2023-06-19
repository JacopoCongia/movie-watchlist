import "./style.css";

const searchFormEl = document.getElementById("search-bar");
const searchBarEl = document.getElementById("search");
const movieListEl = document.getElementById("content");
const startExploringEl = document.getElementById("start-exploring");

const movieArray = [];

searchFormEl.addEventListener("submit", handleFormSubmit);

document.addEventListener("click", (e) => {
  if (e.target.dataset.watchlist) {
    addedToWatchlist(e);
    fetch(
      `http://www.omdbapi.com/?apikey=50a0c6e&i=${e.target.dataset.watchlist}`
    )
      .then((res) => res.json())
      .then((data) => movieArray.push(data))
      .then(() => {
        localStorage.setItem("watchlist", JSON.stringify(movieArray));
      });
  }
});

function addedToWatchlist(e) {
  e.target.parentNode.children[2].textContent = "Added!";
  e.target.parentNode.children[2].style = "color: #00be00";
}

function handleFormSubmit(e) {
  e.preventDefault();
  if (searchBarEl.value) {
    startExploringEl.classList.add("hide-content");
    movieListEl.innerHTML = ``;
    retrieveMovie(searchBarEl.value);
    searchBarEl.value = "";
  }
}

async function retrieveMovie(title) {
  const updatedTitle = title.replace(" ", "+");

  const response = await fetch(
    `https://www.omdbapi.com/?apikey=50a0c6e&s=${updatedTitle}`
  );
  const data = await response.json();
  const titlesArray = data.Search.map((movie) => {
    return movie.Title.replace(/[^A-Z0-9]+/gi, "+");
  });

  const promises = await Promise.all(
    titlesArray.map(async (title) => {
      return await fetch(`https://www.omdbapi.com/?apikey=50a0c6e&t=${title}`);
    })
  );

  const arrayOfResponses = await Promise.all(
    promises.map(async (movie) => {
      return await movie.json();
    })
  );

  arrayOfResponses.map((movie) => {
    if (movie.Title) {
      setMovieListHtml(movie);
    }
  });
}

function setMovieListHtml(movie) {
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
                      <div class="movie-result-watchlist-add" data-watchlist=${imdbID}>
                        <img class="movie-result-watchlist-add-icon" src="./add.png" />
                        <p>Watchlist</p>
                      </div>
                    </div>
                    <p class="movie-result-synopsis">${Plot}</p>
                  </div>
                </div>`;
}
