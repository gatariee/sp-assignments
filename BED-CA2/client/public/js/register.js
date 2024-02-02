import { API } from "./api.js";

class UserRegistration {
	constructor() {
		this.registerForm = document.getElementById("registerForm");
		this.usernameInput = document.getElementById("username");
		this.usernameAvailability = document.getElementById("usernameAvailability");
		this.usernames = [];
		this.usernameAvail = true;

		this.init();
	}

	async init() {
		this.usernameAvailability.innerHTML = '<i class="fas fa-check text-success"></i>';
		await this.getAllUsers();
		this.setupEventListeners();
	}

	async getAllUsers() {
		const api = new API();
		const endpoint = api.get_all_users();
		const response = await fetch(endpoint);
		const data = await response.json();
		this.usernames = data.map((user) => user.username);
	}

	setupEventListeners() {
		this.usernameInput.addEventListener("input", () => this.checkUsernameAvailability());
		this.registerForm.addEventListener("submit", (event) => this.handleRegistration(event));
	}

	checkUsernameAvailability() {
		const username = this.usernameInput.value.trim();
		if (this.usernames.includes(username)) {
			this.usernameAvail = false;
			this.usernameAvailability.innerHTML = '<i class="fas fa-times text-danger"></i>';
		} else {
			this.usernameAvail = true;
			this.usernameAvailability.innerHTML = '<i class="fas fa-check text-success"></i>';
		}
	}

	async handleRegistration(event) {
		event.preventDefault();

		if (!this.usernameAvail) {
			alert("Username not available!");
			return;
		}

		const formData = new FormData(this.registerForm);
		const userData = {
			username: formData.get("username"),
			email: formData.get("email"),
			password: formData.get("password"),
			profile_pic_url: formData.get("profilePicture"),
		};

		if (userData.password !== formData.get("confirmPassword")) {
			alert("Passwords do not match!");
			return;
		}

		const data = await this.registerUser(userData);
		if (data.error) {
			alert(data.error);
			return;
		}

		alert("Registration successful!");

		await new Promise((resolve) => setTimeout(resolve, 2000));

		window.location.href = "/login";
	}

	async registerUser(userData) {
		const api = new API();
		const endpoint = api.register_user();
		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});
		const data = await response.json();
		return data;
	}
}

document.addEventListener("DOMContentLoaded", () => {
	new UserRegistration();
});
