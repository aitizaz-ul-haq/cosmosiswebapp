// src/lib/logUIAction.js
export async function logUIAction(action, metadata = {}) {
  try {
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, metadata }),
      credentials: "include",
    });
  } catch (err) {
    console.error("Failed to send log:", err);
  }
}
