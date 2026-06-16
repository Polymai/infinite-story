import { t } from "../../core/i18n.js";
import { escapeHtml } from "./emptyStates.js";

export function renderChoiceCards(choices = [], options = {}) {
  if (!choices.length) {
    return "";
  }
  const disabled = options.disabled ? "disabled" : "";
  const disabledClass = options.disabled ? " is-disabled" : "";
  return `
    <div class="choice-grid">
      ${choices.map((choice, index) => `
        <button class="choice-card${disabledClass}" type="button" data-choice-index="${index}" ${disabled}>
          <strong>${escapeHtml(choice.label || t("story.choice", { number: index + 1 }))}</strong>
          <span>${escapeHtml(choice.text || "")}</span>
        </button>
      `).join("")}
    </div>
  `;
}
