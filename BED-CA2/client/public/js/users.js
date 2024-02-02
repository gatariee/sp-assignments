import { API } from "./api.js";

/**
 * Represents a class for searching and displaying users.
 * @class
 */
class SearchUsers {
	/**
	 * Create a SearchUsers instance.
	 * @param {API} apiInstance - An instance of the API class.
	 * @param {string} resultsContainerId - The ID of the container element to display search results.
	 * @param {string} searchInputId - The ID of the input element for user search.
	 */
	constructor(apiInstance, resultsContainerId, searchInputId) {
		this.api = apiInstance;
		this.usersResultsContainer =
			document.getElementById(resultsContainerId);
		this.userSearchInput = document.getElementById(searchInputId);

		this.userSearchInput.addEventListener(
			"input",
			this.handleUserSearchInput.bind(this)
		);
		document.addEventListener(
			"DOMContentLoaded",
			this.handleUserSearchDOMContentLoaded.bind(this)
		);
	}

	/**
	 * Display users based on the search term.
	 * @param {string} searchTerm - The search term for filtering users.
	 */
	async displayUsers(searchTerm) {
		try {
			const apiEndpoint = searchTerm
				? this.api.search_user(searchTerm)
				: this.api.get_all_users();
			const response = await fetch(apiEndpoint);
			const data = await response.json();

			this.usersResultsContainer.innerHTML = "";

			if (Array.isArray(data) && data.length > 0) {
				data.forEach((user) => {
					const userCard = this.createUserCard(user);
					this.usersResultsContainer.appendChild(userCard);
				});
			} else {
				const noResults = document.createElement("p");
				noResults.textContent = "No results found.";
				this.usersResultsContainer.appendChild(noResults);
			}
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * Create a user card element.
	 * @param {Object} user - The user data object.
	 * @returns {HTMLElement} - The user card element.
	 */
	createUserCard(user) {
		const userCard = document.createElement("div");
		userCard.classList.add("col-lg-4", "col-md-6", "mb-4", "user-card");

		const profilePic = document.createElement("img");
		profilePic.src = user.profile_pic_url;
		profilePic.alt = `${user.username}'s Profile Picture`;
		profilePic.classList.add("user-profile-pic");
		profilePic.classList.add("img-fluid");
		profilePic.style.cssText = `
		width: 100%;
		height: 400px;
		object-fit: cover;
		border-radius: 8px;
		margin-bottom: 26px;
	  `;

		profilePic.src = user.profile_pic_url;
		profilePic.onerror = function () {
			profilePic.src =
				"https://www.ateneo.edu/sites/default/files/styles/large/public/2021-11/istockphoto-517998264-612x612.jpeg";
		};

		userCard.appendChild(profilePic);

		const username = document.createElement("h3");
		username.textContent = user.username;
		userCard.appendChild(username);

		const userType = document.createElement("p");
		userType.textContent = `Type: ${user.type}`;
		userCard.appendChild(userType);

		const createdAt = document.createElement("p");
		createdAt.textContent = `Created At: ${user.created_at}`;
		userCard.appendChild(createdAt);

		return userCard;
	}

	/**
	 * Handle the user search input event.
	 */
	handleUserSearchInput() {
		const searchTerm = this.userSearchInput.value.trim();
		this.displayUsers(searchTerm);
	}

	/**
	 * Handle the DOMContentLoaded event for initial user display.
	 * This is hit when the page is first loaded.
	 */
	handleUserSearchDOMContentLoaded() {
		this.displayUsers();
	}
}

const api = new API("http://localhost:3000");
const searchUsers = new SearchUsers(api, "userList", "userSearchInput");
