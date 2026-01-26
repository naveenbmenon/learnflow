const API_BASE = "http://127.0.0.1:8000";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Get video_id from URL
const params = new URLSearchParams(window.location.search);
const videoId = params.get("id");

if (!videoId) {
  alert("Invalid video");
  window.location.href = "videos.html";
}

async function loadVideo() {
  try {
    // Fetch video details
    const videoRes = await fetch(`${API_BASE}/videos/${videoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const video = await videoRes.json();

    document.getElementById("videoTitle").innerText = video.title;
    document.getElementById("videoDesc").innerText = video.description || "";

    const filename = video.video_path.split("/").pop();
    document.getElementById("videoPlayer").src =
      `${API_BASE}/media/${filename}`;

    // Fetch questions
    const qRes = await fetch(`${API_BASE}/questions/video/${videoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const questions = await qRes.json();
    const list = document.getElementById("questionList");
    list.innerHTML = "";

    if (questions.length === 0) {
      list.innerHTML = "<li class='list-group-item'>No questions available.</li>";
      return;
    }

    questions.forEach((q, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item";

      li.innerHTML = `
        <strong>Q${index + 1}:</strong> ${q.question_text}
        <br>
        <button class="btn btn-link btn-sm p-0" data-bs-toggle="collapse" data-bs-target="#ans${q.id}">
          Show Answer
        </button>
        <div id="ans${q.id}" class="collapse mt-2 text-muted">
          ${q.answer || "No answer provided"}
        </div>
      `;

      list.appendChild(li);
    });

  } catch (err) {
    alert("Error loading video");
    console.error(err);
  }
}

loadVideo();
