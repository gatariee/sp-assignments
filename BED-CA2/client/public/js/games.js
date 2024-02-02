import { API } from "./api.js";

/**
 * All classes are initialized on DOMContentLoaded! Event handlers are attached as soon as the DOM is ready.
 *
 * KNOWN ISSUES (!!!)
 *   Since event handlers are initiated in class constructors, there may be unexpected behavior if you nest a class inside another class, or wrap a class method in another event handler.</li>
 *   Example:
 *
 * element.addEventListener("DOMContentLoaded", (event) => {
 *     ...do something...
 *     new SearchGames(...);
 * 	@see SearchGames#handleDOMContentLoaded
 * });
 *
 *
 *
 * @see GameCard
 * @see Review
 * @see ReviewList
 * @see SearchGames
 * @see https://example.com/docs  Further documentation link (if available).
 */

class GameCard {
	/**
	 * Represents a game card element displaying game information.
	 * @class
	 * @param {Object} game - A game object containing game information.
	 */

	constructor(game) {
		this.game = game;
		this.element = this.createCard();
		this.element.addEventListener("click", this.handleCardClick.bind(this));
	}

	createCard() {
		/**
		 * Creates a game card element.
		 * @returns {HTMLDivElement} - A div element containing game information.
		 */
		const card = document.createElement("div");
		card.className = "game-card";

		const image = document.createElement("img");
		image.src = this.game.image_name
			? `assets/img/${this.game.image_name}`
			: "assets/img/404.jpg";
		image.onerror = () => {
			image.src = "assets/img/404.jpg";
		};
		image.classList.add("img-fluid");
		image.style.cssText = `
			width: 100%;
			height: 400px;
			object-fit: cover;
			border-radius: 8px;
			margin-bottom: 26px;
	  	`;
		card.appendChild(image);

		const title = document.createElement("h2");
		title.textContent = this.game.title;
		card.appendChild(title);

		const price = document.createElement("p");
		price.textContent = this.game.price
			? `Price: $${this.game.price.toFixed(2)}`
			: "Price: N/A";
		card.appendChild(price);

		const platform = document.createElement("p");
		platform.textContent = this.game.platform
			? `Platform: ${this.game.platform}`
			: "Platform: N/A";
		card.appendChild(platform);
		return card;
	}

	handleCardClick() {
		/**
		 * Handles the click event on a game card.
		 */
		this.viewGameDetails();
	}

	async viewGameDetails() {
		/**
		 * Displays the game details modal, note: heavily inherited from Bootstrap.
		 * @see https://getbootstrap.com/docs/5.0/components/modal/
		 * Changes in the bootstrap CDN may break this functionality.
		 */

		const gameDetailsModalBody = document.getElementById(
			"gameDetailsModalBody"
		);
		gameDetailsModalBody.innerHTML = "";
		gameDetailsModalBody.style.color = "black";
		// fix the dumb white on white bug, this is most likely due to a css issue :)

		const title = document.createElement("h2");
		title.textContent = this.game.title;
		gameDetailsModalBody.appendChild(title);

		const image = document.createElement("img");
		image.src = this.game.image_name
			? `assets/img/${this.game.image_name}`
			: "assets/img/404.jpg";
		image.onerror = () => {
			image.src = "assets/img/404.jpg";
		};
		image.classList.add("img-fluid");
		image.style.cssText = `
			width: 100%;
			height: 400px;
			object-fit: cover;
			border-radius: 8px;
			margin-bottom: 26px;
		`;

		gameDetailsModalBody.appendChild(image);

		const description = document.createElement("p");
		description.textContent = this.game.description
			? `Description: ${this.game.description}`
			: "Description: N/A";
		gameDetailsModalBody.appendChild(description);

		const year = document.createElement("p");
		year.textContent = this.game.year
			? `Year: ${this.game.year}`
			: "Year: N/A";
		gameDetailsModalBody.appendChild(year);

		const reviewsTitle = document.createElement("h3");
		reviewsTitle.textContent = "Reviews";
		gameDetailsModalBody.appendChild(reviewsTitle);

		try {
			const reviewList = new ReviewList(this.game.gameid);
			const reviewsListElement = await reviewList.createReviewList();
			gameDetailsModalBody.appendChild(reviewsListElement);
		} catch (err) {
			console.error(err);
			const errorItem = document.createElement("li");
			errorItem.classList.add("list-group-item");
			errorItem.textContent = "Error while fetching reviews.";
			gameDetailsModalBody.appendChild(errorItem);
		}

		/**
		 * @todo: split this into a class method
		 */

		let cookies = document.cookie;
		let jwtIndex = cookies.indexOf("token=");
		let jwt = null;
		if (jwtIndex !== -1) {
			let tokenSubstring = cookies.substring(jwtIndex + "token=".length);
			let semiColonIndex = tokenSubstring.indexOf(";");
			if (semiColonIndex !== -1) {
				jwt = tokenSubstring.substring(0, semiColonIndex);
			} else {
				jwt = tokenSubstring;
			}
		} else {
			jwt = null;
		}

		const reviewList = new ReviewList(this.game.gameid, jwt);
		const user = await reviewList.getUserInformation();

		if (!user) {
			const loginButton = document.createElement("button");
			loginButton.classList.add("btn", "btn-primary");
			loginButton.textContent = "Login to add a review";
			loginButton.addEventListener("click", () => {
				window.location.href = "/login";
			});
			gameDetailsModalBody.appendChild(loginButton);
		} else {
			const reviewForm = document.createElement("form");
			reviewForm.classList.add("review-form", "mb-4");
			reviewForm.addEventListener("submit", async (event) => {
				event.preventDefault();

				let err = await reviewList.addReview(
					event.target.review.value,
					event.target.rating.value
				);

				if (err) {
					const errorItem = document.createElement("li");
					errorItem.classList.add("list-group-item");
					errorItem.textContent = err.message;
					gameDetailsModalBody.appendChild(errorItem);
				} else {
					const successItem = document.createElement("li");
					successItem.classList.add("list-group-item");
					successItem.textContent = "Review added successfully.";
					gameDetailsModalBody.appendChild(successItem);

					// allow for the user to see the success message
					await new Promise((resolve) => setTimeout(resolve, 1000));

					// reload & re-enter the modal
					this.viewGameDetails();
				}
			});

			const ratingDiv = document.createElement("div");
			ratingDiv.classList.add("mb-3");

			const ratingLabel = document.createElement("label");
			ratingLabel.classList.add("form-label");
			ratingLabel.setAttribute("for", "rating");
			ratingLabel.textContent = "Rating";
			ratingDiv.appendChild(ratingLabel);

			const ratingInput = document.createElement("input");
			ratingInput.classList.add("form-control");
			ratingInput.setAttribute("type", "number");
			ratingInput.setAttribute("name", "rating");
			ratingInput.setAttribute("min", "1");
			ratingInput.setAttribute("max", "5");
			ratingInput.setAttribute("required", "");
			ratingDiv.appendChild(ratingInput);

			reviewForm.appendChild(ratingDiv);

			const reviewDiv = document.createElement("div");
			reviewDiv.classList.add("mb-3");

			const reviewLabel = document.createElement("label");
			reviewLabel.classList.add("form-label");
			reviewLabel.setAttribute("for", "review");
			reviewLabel.textContent = "Review";
			reviewDiv.appendChild(reviewLabel);

			const reviewInput = document.createElement("textarea");
			reviewInput.classList.add("form-control");
			reviewInput.setAttribute("name", "review");
			reviewInput.setAttribute("required", "");
			reviewDiv.appendChild(reviewInput);

			reviewForm.appendChild(reviewDiv);

			const submitButton = document.createElement("button");
			submitButton.setAttribute("type", "submit");
			submitButton.classList.add("btn", "btn-primary");
			submitButton.textContent = "Submit";
			reviewForm.appendChild(submitButton);

			gameDetailsModalBody.appendChild(reviewForm);
		}

		this.showGameDetailsModal();
	}

	showGameDetailsModal() {
		/**
		 * Shows the game details modal.
		 * @see https://getbootstrap.com/docs/5.0/components/modal/
		 */

		const gameDetailsModal = new bootstrap.Modal(
			document.getElementById("gameDetailsModal"),
			{
				backdrop: true,
			}
		);
		gameDetailsModal.show();
	}
}

class Review {
	/**
	 * Represents a review element, to be wrapped by the ReviewList class.
	 * @param {object} review - A review object containing review information.
	 */
	constructor(review) {
		this.review = review;
		this.element = this.createReview();
	}

	createReview() {
		/**
		 * Creates a review HTML element as a list item.
		 * @returns {HTMLLIElement} - A list item element.
		 */
		const listItem = document.createElement("li");
		listItem.classList.add("list-group-item");

		const userRatingDiv = document.createElement("div");
		userRatingDiv.style.display = "flex";
		userRatingDiv.style.flexDirection = "column";

		const userText = document.createElement("p");
		userText.style.marginBottom = "5px";
		userText.textContent = `User: ${this.review.username}`;
		userRatingDiv.appendChild(userText);

		const ratingText = document.createElement("p");
		ratingText.textContent = `Rating: ${this.review.rating}★`;
		// This star may not appear on some browsers that do not support unicode characters.

		userRatingDiv.appendChild(ratingText);

		listItem.appendChild(userRatingDiv);

		const reviewContentText = document.createElement("p");
		reviewContentText.textContent = `Content: ${this.review.content}`;
		listItem.appendChild(reviewContentText);

		const createdAtText = document.createElement("p");
		createdAtText.textContent = `Created at: ${this.review.created_at}`;
		listItem.appendChild(createdAtText);

		return listItem;
	}
}

class ReviewList {
	/**
	 * This class is a wrapper around the Review class.
	 * @param {} gameId - The game ID to fetch reviews for.
	 */

	constructor(gameId, jwt = "") {
		this.gameId = gameId;
		this.element = this.createReviewList();
		this.jwt = jwt;
	}

	async getUserInformation() {
		/**
		 * A function that gets the user information.
		 * @returns {object} - An object containing user information.
		 */
		const userApi = api.get_jwt_info();
		const response = await fetch(userApi, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				token: this.jwt,
			}),
		});
		if (response.status === 400) {
			return false;
		} else {
			return await response.json();
		}
	}

	async addReview(content, rating) {
		/**
		 * A function that creates a new review.
		 * @returns {object} - An object containing the review information.
		 */
		const userInformation = await this.getUserInformation();
		const reviewApi = api.create_review(
			userInformation.user.userid,
			this.gameId
		);

		const response = await fetch(reviewApi, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.jwt}`,
			},
			body: JSON.stringify({
				content: content,
				rating: rating,
			}),
			
		});

		if (response.status === 422) {
			const err = await response.json();
			return err;
		} else {
			return null;
		}
	}

	async createReviewList() {
		/**
		 * A function that creates a list of reviews.
		 * @returns {HTMLUListElement} - A list of reviews.
		 */
		const reviewsList = document.createElement("ul");
		reviewsList.classList.add("list-group");

		try {
			const reviewApi = api.get_review_by_game(this.gameId);
			const response = await fetch(reviewApi);
			const reviews = await response.json();

			if (Array.isArray(reviews) && reviews.length > 0) {
				reviews.forEach((review) => {
					const reviewItem = new Review(review);
					reviewsList.appendChild(reviewItem.element);
				});
			} else {
				const noReviews = document.createElement("li");
				noReviews.classList.add("list-group-item");
				noReviews.textContent = "No reviews found.";
				reviewsList.appendChild(noReviews);
			}
		} catch (err) {
			console.error(err);
			const errorItem = document.createElement("li");
			errorItem.classList.add("list-group-item");
			errorItem.textContent = "Error while fetching reviews.";
			reviewsList.appendChild(errorItem);
		}

		return reviewsList;
	}
}

class SearchGames {
	/**
	 *
	 * @param {API} apiInstance - An instance of the API class.
	 * @param {string} resultsContainerId - The ID of the element to display game results in.
	 * @param {string} searchInputId - The ID of the search input element.
	 */
	constructor(apiInstance, resultsContainerId, searchInputId) {
		this.api = apiInstance;
		this.gameResultsContainer = document.getElementById(resultsContainerId);
		this.searchInput = document.getElementById(searchInputId);

		this.searchInput.addEventListener(
			"input",
			this.handleSearchInput.bind(this)
		);
		document.addEventListener(
			"DOMContentLoaded",
			this.handleDOMContentLoaded.bind(this)
		);

		this.platformFilter = document.getElementById("platform-filter");
		this.platformFilter.addEventListener(
			"change",
			this.handlePlatformFilter.bind(this)
		);
	}

	async displayGames(searchTerm) {
		/**
		
		* Displays games in the game results container.
		 */
		try {
			const apiEndpoint = searchTerm
				? this.api.search_for_game(searchTerm)
				: this.api.get_all_games();
			const response = await fetch(apiEndpoint);
			let data = await response.json();

			const platformFilter = document.getElementById("platform-filter");
			const platform = platformFilter.value;
			if (platform) {
				const platformName =
					platformFilter.options[platformFilter.selectedIndex].text;
				const filteredData = data.filter((game) => {
					return game.platform.includes(platformName);
				});
				data = filteredData;
			}

			this.gameResultsContainer.innerHTML = "";

			if (Array.isArray(data) && data.length > 0) {
				data.forEach((game) => {
					const gameCard = new GameCard(game);
					this.gameResultsContainer.appendChild(gameCard.element);
				});
			} else {
				const noResults = document.createElement("p");
				noResults.textContent = "No results found.";
				this.gameResultsContainer.appendChild(noResults);
			}
		} catch (err) {
			console.error(err);
		}
	}

	async populatePlatformFilter() {
		/**
		 * @desc - Populates the platform filter with platforms from the API.
		 */
		const platformFilter = document.getElementById("platform-filter");
		const platform_api = await this.api.get_platforms();
		const response = await fetch(platform_api);

		const data = await response.json();

		data.forEach((platform) => {
			const platformOption = document.createElement("option");
			platformOption.value = platform.id;
			platformOption.textContent = platform.platformName;
			platformFilter.appendChild(platformOption);
		});
	}

	handleSearchInput() {
		const searchTerm = this.searchInput.value.trim();
		this.displayGames(searchTerm);
	}

	handlePlatformFilter() {
		this.displayGames();
	}

	handleDOMContentLoaded() {
		this.displayGames();
	}
}

class App {
	/**
	 * This class is the entry point of the application.
	 * @param {API} api - An instance of the API class. (build it then pass it in)
	 */

	constructor(api) {
		this.api = api;
		this.searchGames = new SearchGames(
			this.api,
			"game-results",
			"search-input"
		);
	}

	start() {
		/**
		 * Starts the application.
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
		 */
		this.searchGames.displayGames();
		this.searchGames.populatePlatformFilter();
	}
}

const api = new API();

const app = new App(api);
app.start();
