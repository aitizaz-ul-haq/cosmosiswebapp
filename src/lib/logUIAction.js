export async function logUIAction(action, metadata = {}) {
  try {
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, metadata }),
      credentials: "include", // ✅ include user session cookie
    });
  } catch (err) {
    console.error("UI logging failed:", err);
  }
}
