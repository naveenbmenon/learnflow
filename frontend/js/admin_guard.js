function requireAdmin() {
  const token = localStorage.getItem("token");

  if (!token) {
    // Not logged in
    window.location.href = "../login.html";
    return;
  }

  try {
    // Decode JWT payload (base64)
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role !== "admin") {
      // Logged in but not admin
      alert("❌ Access Denied: Admins only");
      window.location.href = "../videos.html";
    }
  } catch (err) {
    // Invalid token
    localStorage.clear();
    window.location.href = "../login.html";
  }
}
