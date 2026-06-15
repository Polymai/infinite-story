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

export function loadingBlock(label = "Loading") {
  return `<div class="status" role="status" aria-busy="true"><strong>${escapeHtml(label)}</strong><span>Please wait while the latest story data loads.</span></div>`;
}

export function errorBlock(message) {
  return statusBlock("Something needs attention", message || "The request failed. Try again in a moment.");
}
