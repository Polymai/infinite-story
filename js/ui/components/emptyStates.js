import { t } from "../../core/i18n.js";

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function statusBlock(title, body, action = "") {
  return `
    <div class="status">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(body)}</span>
      ${action}
    </div>
  `;
}

export function loadingBlock(label = t("status.loading")) {
  return `<div class="status" role="status" aria-busy="true"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(t("status.genericLoadingBody"))}</span></div>`;
}

export function errorBlock(message) {
  return statusBlock(t("status.errorTitle"), message || t("status.errorBody"));
}
