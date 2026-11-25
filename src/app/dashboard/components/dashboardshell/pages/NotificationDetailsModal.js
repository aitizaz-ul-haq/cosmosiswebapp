"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { formatDate } from "./dashboard/data";
import { ModalButton, ModalShell, StatusPill } from "./modalkit/ModalKit";
import "./styles/notifications.css";

function restoreNotificationFocus(trigger, key) {
  const replacement = [...document.querySelectorAll(".notifications-table-page [data-notification-key]")]
    .find((element) => element.dataset.notificationKey === key);
  const target = trigger?.isConnected && trigger.dataset.notificationKey === key ? trigger : replacement || document.querySelector('.notifications-table-page input[type="search"]');
  if (!target?.closest("[inert]")) target?.focus({ preventScroll: true });
}

export default function NotificationDetailsModal({ notification, onClose, readError = "", markingRead = false, onRetryRead }) {
  const dialogRef = useRef(null);
  const open = Boolean(notification);
  const notificationKey = String(notification?.key || notification?.id || "");

  useEffect(() => {
    if (!open) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const trigger = document.activeElement;
    const main = document.querySelector("main.site-main") || document.querySelector(".dashboard-container");
    const previousInert = main?.inert;
    if (main) main.inert = true;
    const focusableElements = () => [...dialog.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')]
      .filter((element) => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length && getComputedStyle(element).visibility !== "hidden");
    const focusFirst = () => (focusableElements()[0] || dialog).focus({ preventScroll: true });
    const keepInside = (event) => { if (!dialog.contains(event.target)) focusFirst(); };
    const trapTab = (event) => {
      if (event.key !== "Tab") return;
      const elements = focusableElements();
      const first = elements[0], last = elements[elements.length - 1];
      if (!first) { event.preventDefault(); dialog.focus(); }
      else if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", trapTab, true);
    document.addEventListener("focusin", keepInside, true);
    focusFirst();
    return () => {
      document.removeEventListener("keydown", trapTab, true);
      document.removeEventListener("focusin", keepInside, true);
      if (main) main.inert = previousInert;
      requestAnimationFrame(() => {
        if (!document.querySelector('.notification-details-overlay [role="dialog"]')) restoreNotificationFocus(trigger, notificationKey);
      });
    };
  }, [open, notificationKey]);

  if (!notification || typeof document === "undefined") return null;
  const userName = notification.userName || notification.username || "Unavailable user";
  const read = notification.status === "Read";
  return createPortal(
    <ModalShell
      size="sm"
      icon="file"
      title="Notification details"
      subtitle="Client activity information."
      overlayClassName="notification-details-overlay"
      wrapperProps={{ ref: dialogRef, tabIndex: -1 }}
      onClose={onClose}
      closeLogTitle="Close notification details"
      footer={<ModalButton variant="neutral" icon="x" onClick={onClose} data-log-title="Close notification details">Close</ModalButton>}
    >
      <dl className="notification-details-message">
        <div><dt>Title</dt><dd className="notification-details-title">{notification.title || "Untitled notification"}</dd></div>
        <div><dt>Description</dt><dd className="notification-details-description">{notification.description || "No description available."}</dd></div>
      </dl>
      <dl className="notification-details-metadata">
        <div><dt>Date and Time</dt><dd>{formatDate(notification.date, true)}</dd></div>
        <div><dt>User</dt><dd>{userName}</dd></div>
        {notification.userEmail && <div><dt>Email</dt><dd>{notification.userEmail}</dd></div>}
        {notification.recipientName && <div><dt>Recipient</dt><dd>{notification.recipientName}</dd></div>}
        <div><dt>Status</dt><dd><StatusPill tone={read ? "green" : "blue"}>{read ? "Read" : "Unread"}</StatusPill></dd></div>
      </dl>
      {markingRead && <p className="notification-details-pending" role="status">Marking as read…</p>}
      {readError && <div className="notification-details-read-error"><p role="alert">{readError}</p>{onRetryRead && <ModalButton variant="primary" icon="clock" onClick={onRetryRead} disabled={markingRead} data-log-title="Retry marking notification as read">Retry</ModalButton>}</div>}
    </ModalShell>,
    document.body
  );
}
