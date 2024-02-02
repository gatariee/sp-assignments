let searchTimeoutId;
const bounce_timer = 100;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/games/image/all");
    const data = await response.json();
    displayResults(data);
  } catch (err) {
    console.error(err);
  }
});

document.getElementById("search-input").addEventListener("input", async (e) => {
  const searchTerm = e.target.value.trim();
  clearTimeout(searchTimeoutId);

  if (searchTerm === "") {
    try {
      const response = await fetch("/api/games/image/all");
      const data = await response.json();
      displayResults(data);
    } catch (err) {
      console.error(err);
    }
    return;
  } else if (searchTerm.length < 2) {
    return;
  }

  searchTimeoutId = setTimeout(async () => {
    try {
      const response = await fetch(`/api/games/image/search=${searchTerm}`);
      const data = await response.json();
      displayResults(data);
    } catch (err) {
      console.error(err);
    }
  }, bounce_timer);
});

function displayResults(data) {
  const gameResultsContainer = document.getElementById("game-results");
  gameResultsContainer.innerHTML = "";

  if (Array.isArray(data) && data.length > 0) {
    data.forEach((game) => {
      const gameCard = createGameCard(game);
      gameResultsContainer.appendChild(gameCard);
    });
  } else {
    gameResultsContainer.innerHTML = "<p>No results found.</p>";
  }
}

function createGameCard(game) {
  const card = document.createElement("div");
  card.classList.add("game-card");
  card.style = "text-align: center;";

  const image = document.createElement("img");
  if (game.image == null) {
    image.src = "/images/404.jpg";
  } else {
    image.src = "/images/" + game.image;
  }
  image.alt = game.title;
  image.style.objectFit = "contain;";
  image.width = 300;
  image.height = 200;
  card.appendChild(image);

  const title = document.createElement("h3");
  title.textContent = game.title;
  card.appendChild(title);

  return card;
}
