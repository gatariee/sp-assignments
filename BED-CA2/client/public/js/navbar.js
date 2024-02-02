/**
 * @fileoverview navbar.js is a file to create the navbar for the website
 * @desc - This file is used to dynamically generate the navbar for every page, it uses a react-style/component approach to generate the navbar.
 * @reqs - Bootstrap 5.2.3
 */

window.addEventListener("DOMContentLoaded", async () => {
	const navbar = document.getElementById("mainNav");
	const token = getCookie("token");
	let loggedIn = false;
	let role = "";

	if (token) {
		try {
			loggedIn = await verifyToken(token);
			role = await getRole(token);
		} catch (error) {
			console.error(error);
		}
	}

	if (loggedIn) {
		if (role == "Admin") {
			navbar.innerHTML += `
      <div class="container px-4 px-lg-5">
      <a class="navbar-brand" href="/">SP Games</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive"
        aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ms-auto my-2 my-lg-0">
          <li class="nav-item">
              <a class="nav-link" href="/admin">Admin Panel</a>
          </li>
          <li class="nav-item">
              <a class="nav-link" href="/games">Games</a>
          </li>
          <li class="nav-item">
              <a class="nav-link" href="/users">Users</a>
          </li>
          <li class="nav-item dropdown">
          <a class="nav-link dropdown" aria-haspopup="true" aria-expanded="false">
          My Account
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="/logout">Logout</a></li>
          </ul>
        </li>
          </ul>
      </div>
    </div>
      `;
		} else if (role == "Customer") {
			navbar.innerHTML += `
        <div class="container px-4 px-lg-5">
        <a class="navbar-brand" href="/">SP Games</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav ms-auto my-2 my-lg-0">
            <li class="nav-item">
                <a class="nav-link" href="/games">Games</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/users">Users</a>
            </li>
            <li class="nav-item dropdown">
            <a class="nav-link dropdown" aria-haspopup="true" aria-expanded="false">
            My Account
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="/logout">Logout</a></li>
            </ul>
          </li>
            </ul>
        </div>
      </div>
      `;
		}
	} else {
		navbar.innerHTML += `
        <div class="container px-4 px-lg-5">
        <a class="navbar-brand" href="/">SP Games</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ms-auto my-2 my-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="/games">Games</a>
            </li>
            <li class="nav-item">
              <a class="nav-link login-link" href="/login">Login</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/register">Register</a>
            </li>
          </ul>
        </div>
      </div>
      `;
	}

	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(";").shift();
	}

	async function verifyToken(token) {
		try {
			const response = await fetch(
				"http://localhost:3000/api/verify/token",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						token: token,
					}),
				}
			);

			const data = await response.json();
			return data.ok;
		} catch (error) {
			console.error("Error:", error);
			return false;
		}
	}

	async function getRole(token) {
		try {
			const response = await fetch(
				"http://localhost:3000/api/verify/token/raw",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						token: token,
					}),
				}
			);

			const data = await response.json();
			if (data == false) {
				new Error("Token is invalid");
			}
			return data.role;
		} catch (error) {
			console.error("Error:", error);
			return false;
		}
	}
});
