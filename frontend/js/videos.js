const API_BASE = "http://127.0.0.1:8000";

// 🔐 Check auth
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/frontend/login.html";
}

// ✅ Store completed video IDs
let completedVideos = new Set();

// 🚪 Logout
function logout() {
  localStorage.clear();
  window.location.href = "/frontend/login.html";
}

// 📥 Fetch completed video IDs
async function loadCompletedVideos() {
  try {
    const res = await fetch(`${API_BASE}/progress/completed`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch completed videos");
    }

    const data = await res.json();
    completedVideos = new Set(data);
  } catch (err) {
    console.error("Error loading completed videos", err);
  }
}

// 📥 Fetch videos
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
    container.innerHTML = "";

    if (videos.length === 0) {
      container.innerHTML = "<p>No videos available.</p>";
      return;
    }

    videos.forEach((video) => {
      const isCompleted = completedVideos.has(video.id);

      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";

      col.innerHTML = `
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">${video.title}</h5>
            <p class="card-text">${video.description || ""}</p>

            <a href="video.html?id=${video.id}" class="btn btn-primary btn-sm me-2">
              Watch Video
            </a>

            <button
              id="complete-${video.id}"
              class="btn btn-sm ${isCompleted ? "btn-secondary" : "btn-success"}"
              ${isCompleted ? "disabled" : ""}
              onclick="markCompleted(${video.id})">
              ${isCompleted ? "Completed ✅" : "Mark as Completed"}
            </button>
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

// 📊 Fetch progress summary
async function loadProgress() {
  try {
    const res = await fetch(`${API_BASE}/progress/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch progress");
    }

    const data = await res.json();

    const percent =
      data.total === 0
        ? 0
        : Math.round((data.completed / data.total) * 100);

    document.getElementById("progressText").innerText =
      `Progress: ${data.completed} / ${data.total}`;

    document.getElementById("progressPercent").innerText =
      `${percent}%`;

    const bar = document.getElementById("progressBar");
    bar.style.width = `${percent}%`;
    bar.setAttribute("aria-valuenow", percent);

  } catch (err) {
    console.error(err);
    document.getElementById("progressText").innerText =
      "Progress unavailable";
  }
}


// ✅ Mark video as completed
async function markCompleted(videoId) {
  try {
    const res = await fetch(
      `${API_BASE}/progress/complete/${videoId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to mark completed");
    }

    // Update local state
    completedVideos.add(videoId);

    // Update UI immediately
    const btn = document.getElementById(`complete-${videoId}`);
    if (btn) {
      btn.disabled = true;
      btn.innerText = "Completed ✅";
      btn.classList.remove("btn-success");
      btn.classList.add("btn-secondary");
    }

    loadProgress();
  } catch (err) {
    alert("Could not mark video as completed");
    console.error(err);
  }
}

// 🚀 Initial page load (ORDER MATTERS)
(async () => {
  await loadCompletedVideos(); // 👈 hydrate state first
  await loadVideos();
  loadProgress();
})();
