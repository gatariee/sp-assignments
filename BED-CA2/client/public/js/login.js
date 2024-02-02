/**
 * @fileoverview login.js is a file to handle the login page.
 * @imports - { API }
 * @reqs - Bootstrap 5.2.3
 */

import { API } from "./api.js";

class Login {
	/**
	 * Create a Login instance.
	 * @param {API} api - An instance of the API class.
	 */
	constructor(api) {
		this.api = api;
		this.loginForm = document.getElementById("loginForm");
		this.errorMessage = document.getElementById("errorMessage");
		this.errorCount = 0;

		this.loginForm.addEventListener(
			"submit",
			this.handleLoginFormSubmit.bind(this)
		);
	}

	/**
	 * Handles the login form submission.
	 * @param {Event} event - The submit event.
	 */
	async handleLoginFormSubmit(event) {
		event.preventDefault();

		const username = document.getElementById("username").value;
		const password = document.getElementById("password").value;

		this.errorMessage.textContent = "";

		try {
			const response = await fetch(this.api.login(), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: username,
					password: password,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				document.cookie = `token=${data.token}; path=/`;
				window.location.href = "/"; // Redirect to the dashboard page after successful login
			} else {
				this.errorCount++;
				this.errorMessage.textContent = `Incorrect login (${this.errorCount} / 5)`;

				if (this.errorCount >= 5) {
					this.handleTooManyAttempts();
				}
			}
		} catch (error) {
			console.error("Error:", error);
			this.errorMessage.textContent =
				"An error occurred. Please try again later.";
		}
	}

	/**
	 * Handles the case of too many login attempts.
	 */
	handleTooManyAttempts() {
		this.errorMessage.innerHTML = `Error: Too many attempts.<br>Redirecting to registration page in 5 seconds...`;

		let countdown = 5;
		const countdownInterval = setInterval(() => {
			countdown--;
			this.errorMessage.innerHTML = `Error: Too many attempts.<br>Redirecting to registration page in ${countdown} seconds...`;
			if (countdown === 0) {
				clearInterval(countdownInterval);
				window.location.href = "/register";
			}
		}, 1000);
	}
}

/**
 * Represents the main application.
 * @class
 */
class App {
	/**
	 * Create an instance of the main application.
	 * @param {API} api - An instance of the API class.
	 */
	constructor(api) {
		this.api = api;
		this.login = new Login(api);
	}

	/**
	 * Start the main application.
	 */
	start() {
		this.login.handleLoginFormSubmit.bind(this.login);
	}
}

const api = new API("http://localhost:3000");
const app = new App(api);
app.start();
