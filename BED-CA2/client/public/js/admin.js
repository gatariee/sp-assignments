/**
 * @fileoverview admin.js is the client side script for admin.html.
 * @desc - This file is used to dynamically generate the admin page, most of the components on the page are generated using components defined in this file.
 * @reqs - Bootstrap 5.2.3
 * @imports - import { API } from "./api.js";
 */

import { API } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
	const addGameForm = document.getElementById("addGameForm");
	const addPlatformForm = document.getElementById("addPlatformForm");
	const selectionDropdown = document.getElementById("selection");
	addGameForm.style.display = "block";
	addPlatformForm.style.display = "none";

	selectionDropdown.addEventListener("change", async () => {
		if (selectionDropdown.value === "game") {
			addGameForm.style.display = "block";
			addPlatformForm.style.display = "none";
		} else {
			addGameForm.style.display = "none";
			addPlatformForm.style.display = "block";
		}
	});

	const addPlatformBtn = document.getElementById("addPlatformBtn");
	const platformsContainer = document.getElementById("platformsContainer");
	var platformCount = 0;
	var categoryCount = 0;

	addPlatformBtn.addEventListener("click", () => {
		platformCount++;
		const platformDiv = createPlatformDiv(platformCount);
		platformsContainer.appendChild(platformDiv);
		populatePlatforms(platformCount);
	});

	function createPlatformDiv(platformCount) {
		/**
		 * @param {number} platformCount - The current count of platforms.
		 * @returns {HTMLDivElement} - The div element containing the platform form.
		 */
		const platformDiv = document.createElement("div");
		platformDiv.classList.add("mb-3");

		const platformNameLabel = document.createElement("label");
		platformNameLabel.textContent = `Platform Name`;
		platformNameLabel.setAttribute("for", `platformName${platformCount}`);
		platformDiv.appendChild(platformNameLabel);

		const platformNameInput = document.createElement("select");
		platformNameInput.setAttribute("class", "form-select");
		platformNameInput.setAttribute("id", `platformName${platformCount}`);
		platformNameInput.setAttribute("name", `platformName${platformCount}`);
		platformNameInput.setAttribute("required", "");
		platformDiv.appendChild(platformNameInput);

		const platformPriceLabel = document.createElement("label");
		platformPriceLabel.textContent = `Platform Price`;
		platformPriceLabel.setAttribute("for", `platformPrice${platformCount}`);
		platformDiv.appendChild(platformPriceLabel);

		const platformPriceInput = document.createElement("input");
		platformPriceInput.setAttribute("type", "number");
		platformPriceInput.setAttribute("class", "form-control");
		platformPriceInput.setAttribute("id", `platformPrice${platformCount}`);
		platformPriceInput.setAttribute(
			"name",
			`platformPrice${platformCount}`
		);
		platformPriceInput.setAttribute("required", "");
		platformPriceInput.setAttribute("min", "0");
		platformPriceInput.setAttribute("step", "any");

		platformDiv.appendChild(platformPriceInput);

		const removePlatformBtn = document.createElement("button");
		removePlatformBtn.setAttribute("type", "button");
		removePlatformBtn.setAttribute("class", "btn btn-danger ms-2");
		removePlatformBtn.textContent = "Remove";
		removePlatformBtn.addEventListener("click", () => {
			platformCount--;
			platformsContainer.removeChild(platformDiv);
		});

		platformDiv.appendChild(removePlatformBtn);

		return platformDiv;
	}

	addCategoryBtn.addEventListener("click", () => {
		categoryCount++;
		const categoryDiv = createCategoryDiv(categoryCount);
		categoriesContainer.appendChild(categoryDiv);
		populateCategories(categoryCount);
	});

	function createCategoryDiv(categoryCount) {
		/**
		 * @param {number} categoryCount - The current count of categories.
		 * @returns {HTMLDivElement} - The div element containing the category form.
		 */
		const categoryDiv = document.createElement("div");
		categoryDiv.classList.add("mb-3");

		const categoryNameLabel = document.createElement("label");
		categoryNameLabel.textContent = `Category ${categoryCount}`;
		categoryNameLabel.setAttribute("for", `categoryName${categoryCount}`);
		categoryDiv.appendChild(categoryNameLabel);

		const categoryNameInput = document.createElement("select");
		categoryNameInput.setAttribute("class", "form-select");
		categoryNameInput.setAttribute("id", `categoryName${categoryCount}`);
		categoryNameInput.setAttribute("name", `categoryName${categoryCount}`);
		categoryNameInput.setAttribute("required", "");
		categoryDiv.appendChild(categoryNameInput);

		const removeCategoryBtn = document.createElement("button");
		removeCategoryBtn.setAttribute("type", "button");
		removeCategoryBtn.setAttribute("class", "btn btn-danger ms-2");
		removeCategoryBtn.textContent = "Remove";

		removeCategoryBtn.addEventListener("click", () => {
			categoryCount--;
			categoriesContainer.removeChild(categoryDiv);
		});
		categoryDiv.appendChild(removeCategoryBtn);

		return categoryDiv;
	}

	async function populateCategories(categoryCount) {
		/**
		 * @param {number} categoryCount - The current count of categories.
		 * @returns {HTMLDivElement} - The div element populated with categories.
		 */
		const categories = await getCategories();
		const categorySelect = document.getElementById(
			`categoryName${categoryCount}`
		);
		categorySelect.innerHTML = "";

		categories.forEach((category) => {
			const option = document.createElement("option");
			option.value = category.id;
			option.textContent = category.categoryName;
			categorySelect.appendChild(option);
		});
	}

	async function loadPlatforms() {
		/**
		 * @returns {Array} - An array of platforms.
		 */
		const platforms = await getPlatforms();
		return platforms;
	}

	async function populatePlatforms(platformCount) {
		/**
		 * @param {number} platformCount - The current count of platforms.
		 */
		const platforms = await getPlatforms();
		const platformSelect = document.getElementById(
			`platformName${platformCount}`
		);
		platformSelect.innerHTML = "";

		platforms.forEach((platform) => {
			const option = document.createElement("option");
			option.value = platform.id;
			option.textContent = platform.platformName;
			platformSelect.appendChild(option);
		});
	}

	addGameForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		const formData = new FormData(addGameForm);
		const gameData = {
			title: formData.get("title"),
			description: formData.get("description"),
			platform_id: getPlatformIds(),
			price: getPlatformPrices(),
			category_id: getCategoryIds(),
			year: formData.get("year"),
			image_url: formData.get("image_url"),
		};

		if (
			new Set(gameData.platform_id.split(",")).size !==
			gameData.platform_id.split(",").length
		) {
			alert("You cannot have duplicate platforms");
			return;
		}

		if (
			new Set(gameData.category_id.split(",")).size !==
			gameData.category_id.split(",").length
		) {
			alert("You cannot have duplicate categories");
			return;
		}

		const currentYear = new Date().getFullYear();
		if (gameData.year > currentYear) {
			alert("Please enter a valid year, cannot be in the future");
			return;
		}

		await addNewGame(gameData);
		addGameForm.reset();

		alert("Game added successfully");
	});

	function getPlatformIds() {
		/**
		 * @returns {string} - A string of platform ids separated by commas.
		 */
		const platforms = document.querySelectorAll('[name^="platformName"]');
		let platformIds = "";
		platforms.forEach((platform) => {
			platformIds += platform.value + ",";
		});

		while (platformIds[platformIds.length - 1] === ",") {
			platformIds = platformIds.slice(0, -1);
		}

		return platformIds;
	}

	function getCategoryIds() {
		/**
		 * @returns {string} - A string of category ids separated by commas.
		 */
		const categories = document.querySelectorAll('[name^="categoryName"]');
		let categoryIds = "";
		categories.forEach((category) => {
			categoryIds += category.value + ",";
		});

		while (categoryIds[categoryIds.length - 1] === ",") {
			categoryIds = categoryIds.slice(0, -1);
		}

		return categoryIds;
	}

	function getPlatformPrices() {
		/**
		 * @returns {string} - A string of platform prices separated by commas.
		 */
		const platformPrices = document.querySelectorAll(
			'[name^="platformPrice"]'
		);
		let prices = "";
		platformPrices.forEach((price) => {
			prices += price.value + ",";
		});

		while (prices[prices.length - 1] === ",") {
			prices = prices.slice(0, -1);
		}

		return prices;
	}

	addPlatformForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		const platformList = await loadPlatforms();
		const formData = new FormData(addPlatformForm);
		const platformData = {
			platform_name: formData.get("platformName"),
			description: formData.get("platformDescription"),
		};

		for (const platform of platformList) {
			if (
				platform.platformName.toLowerCase() ===
				platformData.platform_name.toLowerCase()
			) {
				alert("Platform already exists");
				return;
			}
		}

		if (platformData.platform_name && platformData.description) {
			await addNewPlatform(platformData);
			addPlatformForm.reset();
		} else {
			alert("Please provide both Platform Name and Platform Price.");
		}
	});
});

async function addNewGame(gameData) {
	/**
	 * @param {object} gameData - The data of the game to be added.
	 * @reqs {title, description, platform_id, price, category_id, year, image_url}
	 */
	try {
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
		const api = new API();
		const game_endpoint = api.post_game();
		const response = await fetch(game_endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
			body: JSON.stringify(gameData),
		});
		const data = await response.json();
		console.log("New game added:", data);
	} catch (error) {
		alert("Error adding new game:", error);
	}
}

async function addNewPlatform(platformData) {
	/**
	 * @param {object} platformData - The data of the platform to be added.
	 * @reqs {platform_name, description}
	 */
	try {
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
		const api = new API();
		const platform_endpoint = api.post_platform();
		const response = await fetch(platform_endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
			body: JSON.stringify(platformData),
		});

		const data = await response.json();
		console.log("New platform added:", data);
	} catch (error) {
		alert("Error adding new platform:", error);
	}
}

async function getPlatforms() {
	/**
	 * @returns {array} - An array of platform objects.
	 */
	try {
		console.log("Fetching platforms...");
		const api = new API();
		const platform_endpoint = api.get_platforms();
		const response = await fetch(platform_endpoint);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching platforms:", error);
		return [];
	}
}

async function getCategories() {
	/**
	 * @async @function getCategories
	 * @returns {array} - An array of category objects.
	 * @description - Fetches all categories from the API.
	 */
	try {
		const api = new API();
		const category_endpoint = api.get_categories();
		const response = await fetch(category_endpoint);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching categories:", error);
		return [];
	}
}
