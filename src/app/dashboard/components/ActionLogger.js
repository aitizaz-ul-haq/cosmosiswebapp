"use client";

import { useEffect } from "react";
import { logUIAction as bufferLog } from "@/lib/logger";

/**
 * ActionLogger
 * ------------
 * Mounts a single capture-phase click listener on the document and records
 * every meaningful interactive click (buttons, links, menu options, anything
 * marked with `data-log-title`).
 *
 * Each interaction is logged (batched) as a "button_click" action together with
 * a human readable title, so the superadmin can later reconstruct exactly what a
 * user did during a session.
 *
 * Add `data-log-title="..."` to any element to control the logged title,
 * or `data-log-ignore` to skip logging a specific element.
 */
export default function ActionLogger({ context = "app" }) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const INTERACTIVE_SELECTOR =
      'button, a, [role="button"], .menu-options, [data-log-title]';

    const getTitle = (el) => {
      const explicit = el.getAttribute?.("data-log-title");
      if (explicit) return explicit.trim();

      const aria = el.getAttribute?.("aria-label");
      if (aria) return aria.trim();

      const titleAttr = el.getAttribute?.("title");
      if (titleAttr) return titleAttr.trim();

      const text = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
      if (text) {
        // Close / dismiss icons (✕, ×, X) — make them human readable
        if (/^(✕|×|x|✖|❌)$/i.test(text)) return "Close dialog";
        return text.slice(0, 120);
      }

      // Fall back to an image title/alt inside the element (icon-only buttons)
      const img = el.querySelector?.("img[title], img[alt]");
      if (img) {
        const t = img.getAttribute("title") || img.getAttribute("alt");
        if (t) return t.trim();
      }

      // Last resort: derive a readable name from the element's class list
      const cls = (el.getAttribute?.("class") || "")
        .split(/\s+/)
        .find((c) => c && !c.startsWith("active"));
      if (cls) {
        return cls
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (m) => m.toUpperCase())
          .trim();
      }

      return "Unlabeled control";
    };

    const handleClick = (e) => {
      const target = e.target;
      if (!target || typeof target.closest !== "function") return;

      const el = target.closest(INTERACTIVE_SELECTOR);
      if (!el) return;
      if (el.closest("[data-log-ignore]")) return;

      const title = getTitle(el);

      bufferLog("button_click", {
        title,
        context,
        tag: el.tagName?.toLowerCase() || null,
        path: typeof window !== "undefined" ? window.location.pathname : null,
      });
    };

    document.addEventListener("click", handleClick, true); // capture phase
    return () => document.removeEventListener("click", handleClick, true);
  }, [context]);

  return null;
}
