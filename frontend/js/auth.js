const API_BASE = "http://127.0.0.1:8000";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Login failed");
    }

    // Save token
    localStorage.setItem("token", data.access_token);

    // TEMP: send everyone to videos page
    window.location.href = "videos.html";

  } catch (err) {
    document.getElementById("error").innerText = "Login failed";
    console.error(err);
  }
});
function logout() {
  localStorage.clear();
  window.location.href = "../login.html";
}
