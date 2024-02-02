/**
 * @fileoverview api.js is a file to store API endpoints.
 * @imports - N/A
 * @exports - { API } - Example Import: import { API } from "./api.js";
 */

export class API {
	/**
	 * This class is used to store API endpoints, in the event that the endpoint changes.
	 * @optional param {string} baseURL - The base URL of the API. 
	 * 
	 * Default: "http://localhost:3000"
	 */

	constructor(baseURL = "http://localhost:3000") {
		/**
		 * Uses "http://localhost:3000" as the default base URL, change as required.
		 */
		this.baseURL = baseURL;
	}

	// Referenced in search.js
	get_all_games() {
		/**
		 * @returns {string} - The endpoint to get all games.
		 * @auth - Customer
		 */
		return `${this.baseURL}/api/games/all`;
	}

	search_for_game(query) {
		/**
		 * @param {string} query - The search query.
		 * @returns {string} - The endpoint to search for games based on a search query.
		 * @auth - Customer
		 */
		return `${this.baseURL}/api/games/search=${query}`;
	}

	get_review_by_game(game_id) {
		/**
		 * @param {string} game_id - The game ID.
		 * @returns {string} - The endpoint to get reviews for a specific game.
		 */
		return `${this.baseURL}/api/reviews/${game_id}`;
	}

	login() {
		/**
		 * @returns {string} - The endpoint to login.
		 * @auth - Customer
		 */
		return `${this.baseURL}/api/login`;
	}

	get_jwt_info() {
		/**
		 * @returns {string} - The endpoint to get JWT info.
		 * @auth - Customer
		 * @info - POST jwt token in body to endpoint, 
		 * @apiReturn - Returns the decoded JWT token.
		 */
		return `${this.baseURL}/api/verify/token/raw`;
	}

	get_all_users() {
		/**
		 * @returns {string} - The endpoint to get all users.
		 * @auth - Customer
		 */
		return `${this.baseURL}/api/v1/users/all`;
	}

	search_user(query) {
		/**
		 * @param {string} query - The search query.
		 * @returns {string} - The endpoint to search for users based on a search query.
		 * @auth - Customer
		 */
		return `${this.baseURL}/api/v1/query/users/search=${query}`;
	}

	create_review(uid, gid) {
		/**
		 * @param {string} uid - The user ID.
		 * @param {string} gid - The game ID.
		 * @returns {string} - The endpoint to create a review.
		 * @auth - Customer
		 */
		return `${this.baseURL}/api/v1/reviews/uid/${uid}/gid/${gid}`;
	}

	register_user() {
		/**
		 * @returns {string} - The endpoint to register a user.
		 * @auth - Customer
		 * @reminder - POST username, email, password, profile_pic
		 */
		return `${this.baseURL}/api/v1/user`;
	}

	get_platforms() {
		/**
		 * @returns {string} - The endpoint to get all platforms.
		 * @auth - Customer
		 */
		return `${this.baseURL}/api/platforms/all`;
	}

	get_categories() {
		/**
		 * @returns {string} - The endpoint to get all categories.
		 * @auth - Customer
		 */
		return `${this.baseURL}/api/categories/all`;
	}

	post_game() {
		/**
		 * @returns {string} - The endpoint to create a game.
		 * @auth - Admin
		 */
		return `${this.baseURL}/api/admin/game`;
	}

	post_platform() {
		/**
		 * @returns {string} - The endpoint to create a platform.
		 * @auth - Admin
		 */
		return `${this.baseURL}/api/admin/platform`;
	}
}
