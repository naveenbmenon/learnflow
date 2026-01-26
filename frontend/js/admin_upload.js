const API = "http://127.0.0.1:8000";
const token = localStorage.getItem("token");

if (!token) location.href = "../login.html";

const statusBox = document.getElementById("status");

function showStatus(message, type = "success") {
  statusBox.className = `alert alert-${type}`;
  statusBox.innerText = message;
  statusBox.classList.remove("d-none");
}

function logout() {
  localStorage.clear();
  window.location.href = "../login.html";
}

async function loadVideos() {
  try {
    const res = await fetch(`${API}/videos/`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error();

    const videos = await res.json();
    const list = document.getElementById("videoList");
    list.innerHTML = "";

    videos.forEach(v => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
        <span>${v.title}</span>
        <div>
          <a href="edit.html?id=${v.id}" class="btn btn-sm btn-secondary me-1">
            Edit
          </a>
          <button class="btn btn-sm btn-danger" onclick="deleteVideo(${v.id})">
            Delete
          </button>
        </div>
      `;

      list.appendChild(li);
    });

  } catch {
    showStatus("❌ Failed to load videos", "danger");
  }
}

async function deleteVideo(id) {
  if (!confirm("Are you sure you want to delete this video?")) return;

  try {
    const res = await fetch(`${API}/videos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error();

    showStatus("🗑 Video deleted successfully");
    loadVideos();

  } catch {
    showStatus("❌ Failed to delete video", "danger");
  }
}

document.getElementById("uploadForm").addEventListener("submit", async e => {
  e.preventDefault();
  statusBox.classList.add("d-none");

  const fd = new FormData();
  fd.append("title", title.value);
  fd.append("description", description.value);
  fd.append("file", file.files[0]);

  try {
    const res = await fetch(`${API}/videos/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });

    if (!res.ok) throw new Error();

    showStatus("✅ Video uploaded successfully");
    uploadForm.reset();
    loadVideos();

  } catch {
    showStatus("❌ Video upload failed", "danger");
  }
});

loadVideos();
