import { escapeHtml } from "./emptyStates.js";

export function renderTypewriterText(text = "") {
  return `<div class="chapter-text typewriter">${escapeHtml(text).replaceAll("\n", "<br>")}</div>`;
}
