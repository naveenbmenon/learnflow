const API = "http://127.0.0.1:8000";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  console.log("AUTH.JS LOADED — FORM DATA VERSION");

  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("error");

  errorBox.innerText = "";

  try {
    // ✅ BACKEND EXPECTS FORM DATA
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      body: formData
      // ❌ DO NOT set Content-Type manually
    });

    if (!res.ok) {
      errorBox.innerText = "❌ Invalid email or password";
      return;
    }

    const data = await res.json();

    // Save JWT
    localStorage.setItem("token", data.access_token);

    // Redirect after login
    window.location.href = "/frontend/videos.html";

  } catch (err) {
    console.error(err);
    errorBox.innerText = "❌ Server error. Try again.";
  }
});
