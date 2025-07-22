function heartbeat() {
  const token = localStorage.getItem("access_token");

  fetch("http://127.0.0.1:8000/api/v1/ping", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => {
    if (res.status === 401) {
      console.warn("Token invalid. Logging out...");
      localStorage.clear();
      window.location.href = "index.html";
    }
  })
  .catch(() => {
    console.warn("Server unreachable. Check your internet.");
    // You can show a red dot, offline message, etc.
  });
}

// Start the heartbeat
setInterval(heartbeat, 10); // Every 10 seconds
