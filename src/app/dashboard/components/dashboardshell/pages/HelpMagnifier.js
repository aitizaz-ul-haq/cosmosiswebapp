"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./styles/help-magnifier.css";

const DIAMETER = 200;
const ZOOM = 2;
const IGNORED_TARGETS = "input, textarea, select, button, a, label, [contenteditable='true'], .compliance-help-floating-actions, [data-help-magnifier-ignore]";
const OMIT_FROM_COPY = ".compliance-help-floating-actions, .help-reading-lens, [data-help-magnifier-ignore]";

function copyForReading(source) {
  const copy = source.cloneNode(true);
  copy.querySelectorAll(OMIT_FROM_COPY).forEach((element) => element.remove());
  // The copy is visual only: it must not introduce duplicate labels, targets,
  // live announcements, form groups or keyboard stops into the real page.
  [copy, ...copy.querySelectorAll("*")].forEach((element) => {
    for (const attribute of [...element.attributes]) {
      if (/^(id|for|form|name|autofocus|tabindex|role)$/i.test(attribute.name) || attribute.name.startsWith("aria-")) element.removeAttribute(attribute.name);
    }
    if (element.matches("a, button, input, select, textarea, [contenteditable]")) element.setAttribute("tabindex", "-1");
    if (element.hasAttribute("contenteditable")) element.setAttribute("contenteditable", "false");
  });
  copy.classList.remove("is-magnifying");
  copy.classList.add("help-reading-lens-source");
  copy.setAttribute("aria-hidden", "true");
  copy.setAttribute("inert", "");
  return copy;
}

function backgroundBehind(source) {
  for (let element = source; element; element = element.parentElement) {
    const color = getComputedStyle(element).backgroundColor;
    if (color && color !== "transparent" && color !== "rgba(0, 0, 0, 0)") return color;
  }
  return "#f6f9ff";
}

function clippingParents(source) {
  const parents = [];
  for (let element = source.parentElement; element && element !== document.documentElement; element = element.parentElement) {
    const style = getComputedStyle(element);
    const x = /auto|scroll|hidden|clip/.test(style.overflowX);
    const y = /auto|scroll|hidden|clip/.test(style.overflowY);
    if (x || y) parents.push({ element, x, y });
  }
  return parents;
}

// A single DOM copy keeps the original line wrapping, colours and font metrics.
// Pointer movement only updates two transforms; it does not render React or clone
// the guide again. Search, resizing and theme changes refresh the visual copy.
export default function HelpMagnifier({ enabled, sourceRef, contentVersion }) {
  const lensRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const source = sourceRef.current;
    const lens = lensRef.current;
    const content = contentRef.current;
    if (!source || !lens || !content) return undefined;
    const clipping = clippingParents(source);
    let pointer = null;
    let frame = 0;
    let disposed = false;
    let needsCopy = true;
    let copiedWidth = 0;
    let copiedHeight = 0;
    const hide = () => { lens.style.visibility = "hidden"; };

    const refreshCopy = () => {
      const bounds = source.getBoundingClientRect();
      const style = getComputedStyle(source);
      const copy = copyForReading(source);
      // The body portal lives outside the dashboard's inherited typography and
      // custom properties. Copy these explicitly, including heading/theme tokens.
      for (const property of [...style]) {
        if (property.startsWith("--")) copy.style.setProperty(property, style.getPropertyValue(property));
      }
      for (const property of ["fontFamily", "fontSize", "fontWeight", "fontStyle", "lineHeight", "letterSpacing", "color", "textAlign", "direction", "textRendering", "webkitFontSmoothing"]) copy.style[property] = style[property];
      Object.assign(copy.style, {
        width: `${bounds.width}px`, minWidth: `${bounds.width}px`, maxWidth: `${bounds.width}px`,
        height: `${bounds.height}px`, minHeight: "0", margin: "0", boxSizing: "border-box",
        position: "relative", inset: "auto", transform: "none", pointerEvents: "none",
      });
      lens.style.backgroundColor = backgroundBehind(source);
      content.replaceChildren(copy);
      copiedWidth = bounds.width;
      copiedHeight = bounds.height;
      needsCopy = false;
    };

    const update = () => {
      frame = 0;
      if (disposed) return;
      if (needsCopy) refreshCopy();
      if (!pointer || !source.isConnected) { hide(); return; }
      const target = document.elementFromPoint(pointer.x, pointer.y);
      if (!target || !source.contains(target) || target.closest(IGNORED_TARGETS) || source.closest("[inert]")) { hide(); return; }
      const sourceBounds = source.getBoundingClientRect();
      const viewport = window.visualViewport;
      const visible = {
        left: Math.max(sourceBounds.left, viewport?.offsetLeft || 0),
        top: Math.max(sourceBounds.top, viewport?.offsetTop || 0),
        right: Math.min(sourceBounds.right, (viewport?.offsetLeft || 0) + (viewport?.width || document.documentElement.clientWidth)),
        bottom: Math.min(sourceBounds.bottom, (viewport?.offsetTop || 0) + (viewport?.height || window.innerHeight)),
      };
      for (const parent of clipping) {
        const bounds = parent.element.getBoundingClientRect();
        if (parent.x) { visible.left = Math.max(visible.left, bounds.left); visible.right = Math.min(visible.right, bounds.right); }
        if (parent.y) { visible.top = Math.max(visible.top, bounds.top); visible.bottom = Math.min(visible.bottom, bounds.bottom); }
      }
      if (pointer.x < visible.left || pointer.x > visible.right || pointer.y < visible.top || pointer.y > visible.bottom) { hide(); return; }
      const size = Math.min(DIAMETER, visible.right - visible.left - 8, visible.bottom - visible.top - 8);
      if (size < 80) { hide(); return; }
      const radius = size / 2;
      const centerX = Math.max(visible.left + radius + 4, Math.min(pointer.x, visible.right - radius - 4));
      // During a touch gesture, offset the lens above the finger while sampling
      // the text under that finger. Native touch scrolling remains available.
      const preferredY = pointer.touch ? pointer.y - radius - 24 : pointer.y;
      const centerY = Math.max(visible.top + radius + 4, Math.min(preferredY, visible.bottom - radius - 4));
      lens.style.width = `${size}px`;
      lens.style.height = `${size}px`;
      lens.style.transform = `translate3d(${centerX - radius}px, ${centerY - radius}px, 0)`;
      content.style.transform = `translate3d(${radius - ZOOM * (pointer.x - sourceBounds.left)}px, ${radius - ZOOM * (pointer.y - sourceBounds.top)}px, 0) scale(${ZOOM})`;
      lens.style.visibility = "visible";
    };
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(update); };
    const refresh = () => { needsCopy = true; schedule(); };
    const move = (event) => {
      if (event.isPrimary === false) { pointer = null; hide(); return; }
      pointer = { x: event.clientX, y: event.clientY, touch: event.pointerType === "touch" };
      schedule();
    };
    const leave = () => { pointer = null; hide(); };
    const endTouch = (event) => { if (event.pointerType === "touch") leave(); };
    const resizeObserver = new ResizeObserver(() => {
      const bounds = source.getBoundingClientRect();
      if (bounds.width !== copiedWidth || bounds.height !== copiedHeight) refresh();
      else schedule();
    });
    resizeObserver.observe(source);
    const themeObserver = new MutationObserver(refresh);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-dashboard-theme"] });
    source.addEventListener("pointermove", move, { passive: true });
    source.addEventListener("pointerdown", move, { passive: true });
    source.addEventListener("pointerleave", leave);
    document.addEventListener("pointerup", endTouch, { passive: true });
    document.addEventListener("pointercancel", endTouch, { passive: true });
    document.addEventListener("scroll", schedule, { capture: true, passive: true });
    window.addEventListener("resize", refresh, { passive: true });
    window.addEventListener("blur", leave);
    window.visualViewport?.addEventListener("resize", refresh, { passive: true });
    window.visualViewport?.addEventListener("scroll", schedule, { passive: true });
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      source.removeEventListener("pointermove", move);
      source.removeEventListener("pointerdown", move);
      source.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerup", endTouch);
      document.removeEventListener("pointercancel", endTouch);
      document.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("blur", leave);
      window.visualViewport?.removeEventListener("resize", refresh);
      window.visualViewport?.removeEventListener("scroll", schedule);
      content.replaceChildren();
      hide();
    };
  }, [enabled, sourceRef, contentVersion]);

  if (!enabled || typeof document === "undefined") return null;
  return createPortal(
    <div ref={lensRef} className="help-reading-lens" aria-hidden="true" inert="" data-help-magnifier-ignore>
      <div ref={contentRef} className="help-reading-lens-content" />
    </div>,
    document.body
  );
}
