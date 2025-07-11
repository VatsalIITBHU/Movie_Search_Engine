const apiKey = "928e826b";

const suggestedTitles = [
  "Oppenheimer",
  "Dune",
  "Spider-Man: No Way Home",
  "The Batman",
  "John Wick",
  "Top Gun",
  "Barbie",
  "Avatar: The Way of Water",
];

window.onload = () => {
  showSuggestedMovies();
};

async function searchMovies() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;
  fetchAndDisplayMovies(query);
}

async function showSuggestedMovies() {
  document.getElementById("movieList").innerHTML =
    "<p>Loading suggestions...</p>";

  let movies = [];
  for (let title of suggestedTitles) {
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(
      title
    )}&apikey=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.Response === "True" && data.Search.length > 0) {
        movies.push(data.Search[0]);
      }
    } catch (error) {
      console.error("Error fetching suggestion:", error);
    }
  }

  renderMovies(movies);
}

async function fetchAndDisplayMovies(query) {
  const url = `https://www.omdbapi.com/?s=${encodeURIComponent(
    query
  )}&apikey=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "True") {
      renderMovies(data.Search);
    } else {
      document.getElementById("movieList").innerHTML =
        "<p>No movies found.</p>";
    }
  } catch (error) {
    console.error("Search error:", error);
  }
}

function renderMovies(movies) {
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = "";

  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML = `
      <img src="${
        movie.Poster !== "N/A"
          ? movie.Poster
          : "https://via.placeholder.com/200x300"
      }" alt="${movie.Title}">
      <div class="info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year} | ${movie.Type}</p>
      </div>
    `;
    card.addEventListener("click", () => showPopup(movie.imdbID));
    movieList.appendChild(card);
  });
}

async function showPopup(imdbID) {
  const url = `https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "True") {
      const popupDetails = document.getElementById("popupDetails");
      popupDetails.innerHTML = `
        <img src="${
          data.Poster !== "N/A"
            ? data.Poster
            : "https://via.placeholder.com/150"
        }" />
        <h2>${data.Title} (${data.Year})</h2>
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Director:</strong> ${data.Director}</p>
        <p><strong>Actors:</strong> ${data.Actors}</p>
        <p><strong>Plot:</strong> ${data.Plot}</p>
        <p><strong>IMDb Rating:</strong> ${data.imdbRating}</p>
      `;
      document.getElementById("popup").classList.remove("hidden");
    }
  } catch (error) {
    console.error("Popup fetch error:", error);
  }
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}
