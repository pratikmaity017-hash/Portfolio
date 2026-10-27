const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");

let csrfToken = null;

API_BASE_URL = "https://portfolio-z7ut.onrender.com/api";

async function getCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok || !result.csrfToken) {
    throw new Error("Unable to initialize secure login");
  }

  csrfToken = result.csrfToken;
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginMessage.textContent = "Signing in...";

  try {
    if (!csrfToken) {
      await getCsrfToken();
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        email: emailInput.value.trim(),
        password: passwordInput.value,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    // Login regenerates the session, so obtain its new CSRF token.
    await getCsrfToken();

    loginMessage.textContent = "Login successful! Redirecting...";

    window.location.href = "index.html";
  } catch (error) {
    csrfToken = null;
    loginMessage.textContent =
      error.message || "Something went wrong. Please try again.";
  }
});

// Initialize the CSRF token when the login page loads.
getCsrfToken().catch(() => {
  loginMessage.textContent =
    "Unable to connect securely. Please refresh and try again.";
});
