import { escapeHtml } from "./emptyStates.js";

export function renderChoiceCards(choices = []) {
  if (!choices.length) {
    return "";
  }
  return `
    <div class="choice-grid">
      ${choices.map((choice, index) => `
        <button class="choice-card" type="button" data-choice-index="${index}">
          <strong>${escapeHtml(choice.label || `Choice ${index + 1}`)}</strong>
          <span>${escapeHtml(choice.text || "")}</span>
        </button>
      `).join("")}
    </div>
  `;
}
