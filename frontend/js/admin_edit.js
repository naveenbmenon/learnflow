const statusBox = document.getElementById("status");

function showStatus(msg, type = "success") {
  statusBox.className = `alert alert-${type}`;
  statusBox.innerText = msg;
  statusBox.classList.remove("d-none");
}


const API = "http://127.0.0.1:8000";
const token = localStorage.getItem("token");
const id = new URLSearchParams(location.search).get("id");

async function load() {
  const v = await fetch(`${API}/videos/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  title.value = v.title;
  description.value = v.description || "";

  const qs = await fetch(`${API}/questions/video/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  questions.innerHTML = "";
  qs.forEach(q => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
      ${q.question_text}
      <button class="btn btn-sm btn-danger float-end" onclick="del(${q.id})">X</button>
    `;
    questions.appendChild(li);
  });
}

async function saveVideo() {
  try {
    const fd = new FormData();
    fd.append("title", title.value);
    fd.append("description", description.value);

    const res = await fetch(`${API}/videos/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });

    if (!res.ok) throw new Error();

    showStatus("✅ Video updated successfully");
  } catch {
    showStatus("❌ Failed to update video", "danger");
  }
}


async function addQuestion() {
  try {
    const fd = new FormData();
    fd.append("video_id", id);
    fd.append("question_text", newQ.value);
    fd.append("answer", newAnswer.value);


    const res = await fetch(`${API}/questions/add`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });

    if (!res.ok) throw new Error();

    newQ.value = "";
    showStatus("✅ Question added");
    load();
  } catch {
    showStatus("❌ Failed to add question", "danger");
  }
}


async function del(qid) {
  try {
    await fetch(`${API}/questions/${qid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    showStatus("🗑 Question deleted");
    load();
  } catch {
    showStatus("❌ Failed to delete question", "danger");
  }
}

function logout() {
  localStorage.clear();
  window.location.href = "/frontend/login.html";
}


load();
