const API_BASE = "http://127.0.0.1:8000";

// Check auth
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Fetch videos
async function loadVideos() {
  try {
    const res = await fetch(`${API_BASE}/videos/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch videos");
    }

    const videos = await res.json();
    const container = document.getElementById("videoList");

    if (videos.length === 0) {
      container.innerHTML = "<p>No videos available.</p>";
      return;
    }

    videos.forEach((video) => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";

      col.innerHTML = `
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">${video.title}</h5>
            <p class="card-text">${video.description || ""}</p>
            <a href="video.html?id=${video.id}" class="btn btn-primary btn-sm">
              Watch Video
            </a>
          </div>
        </div>
      `;

      container.appendChild(col);
    });
  } catch (err) {
    alert("Error loading videos");
    console.error(err);
  }
}
function logout() {
  localStorage.clear();
  window.location.href = "../login.html";
}

// Load on page start
loadVideos();
