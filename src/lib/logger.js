// src/lib/logger.js (frontend version)
let logBuffer = [];
let flushTimer = null;

// 🔹 Log a UI action (default: batched)
export function logUIAction(action, metadata = {}, immediate = false) {
  const logEntry = {
    action,
    metadata,
    timestamp: Date.now(),
  };

  if (immediate) {
    // 🚀 send directly (critical events: login, logout, errors)
    sendLogs([logEntry]);
  } else {
    // 🌀 batch it
    logBuffer.push(logEntry);
    if (logBuffer.length >= 10) flushLogs(); // flush when 10 logs
    scheduleFlush(); // schedule timed flush
  }
}

// 🔹 Flush logs (send current buffer)
async function flushLogs() {
  if (logBuffer.length === 0) return;

  const logsToSend = [...logBuffer];
  logBuffer = [];

  await sendLogs(logsToSend);
}

// 🔹 Send logs to backend
async function sendLogs(logs) {
  try {
    await fetch("/api/log/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs }),
      credentials: "include",
    });
  } catch (err) {
    console.error("Failed to send logs:", err);
    // 🔁 Optionally, requeue logs on failure
    logBuffer.push(...logs);
  }
}

// 🔹 Schedule auto-flush every 5 seconds
function scheduleFlush() {
  if (flushTimer) return; // already scheduled
  flushTimer = setTimeout(() => {
    flushLogs();
    flushTimer = null;
  }, 5000);
}

// 🔹 Before page unload → flush
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (logBuffer.length === 0) return;
    const logsToSend = [...logBuffer];
    logBuffer = [];
    // Use sendBeacon so the request survives the page unload
    try {
      const blob = new Blob([JSON.stringify({ logs: logsToSend })], {
        type: "application/json",
      });
      const ok = navigator.sendBeacon?.("/api/log/batch", blob);
      if (!ok) sendLogs(logsToSend);
    } catch {
      sendLogs(logsToSend);
    }
  });
}
