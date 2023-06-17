const apiKey = "d7deb228"; 

const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", searchMovies);


async function searchMovies(page) {
  const searchInput = document.getElementById("search-input").value;
  const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(
    searchInput
  )}&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
      displayPagination(data.totalResults, page);
    } else {
      displayErrorMessage(data.Error);
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

function displayMovies(movies) {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    resultsContainer.appendChild(movieCard);
  });
}

function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const img = document.createElement("img");
  img.src = movie.Poster === "N/A" ? "no-poster.jpg" : movie.Poster;
  movieCard.appendChild(img);

  const title = document.createElement("h3");
  title.textContent = movie.Title;
  movieCard.appendChild(title);

  const year = document.createElement("p");
  year.textContent = movie.Year;
  movieCard.appendChild(year);

  const detailsButton = document.createElement("button");
  detailsButton.textContent = "View Details";
  detailsButton.addEventListener("click", () => {
    viewMovieDetails(movie.imdbID);
  });
  movieCard.appendChild(detailsButton);

  return movieCard;
}

function displayErrorMessage(message) {
  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = `<p class="error">${message}</p>`;
}

async function viewMovieDetails(imdbID) {
  const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = ""; // Clear previous details

    const title = document.createElement("h2");
    title.textContent = data.Title;
    detailsContainer.appendChild(title);

    const poster = document.createElement("img");
    poster.src = data.Poster === "N/A" ? "no-poster.jpg" : data.Poster;
    detailsContainer.appendChild(poster);

    const plot = document.createElement("p");
    plot.textContent = data.Plot;
    detailsContainer.appendChild(plot);

    const genre = document.createElement("p");
    genre.textContent = `Genre: ${data.Genre}`;
    detailsContainer.appendChild(genre);

    const cast = document.createElement("p");
    cast.textContent = `Cast: ${data.Actors}`;
    detailsContainer.appendChild(cast);

    // Add more details as needed
  } catch (error) {
    console.log("Error:", error);
  }
}



function displayPagination(totalResults, currentPage) {
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalResults / 10); // Assuming 10 results per page

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement("a");
    pageLink.textContent = i;
    pageLink.href = "#";
    pageLink.classList.add("page-link");

    if (i === currentPage) {
      pageLink.classList.add("active");
    }

    pageLink.addEventListener("click", () => {
      searchMovies(i);
    });

    paginationContainer.appendChild(pageLink);
  }
}


