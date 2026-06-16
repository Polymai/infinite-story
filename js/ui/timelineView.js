import { t } from "../core/i18n.js";
import { escapeHtml, statusBlock } from "./components/emptyStates.js";

export function renderTimelineView(state) {
  const items = state.timeline || [];
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">${escapeHtml(t("timeline.kicker"))}</span>
          <h1 class="view-title">${escapeHtml(t("timeline.title"))}</h1>
          <p>${escapeHtml(t("timeline.body"))}</p>
        </div>
      </header>
      <div class="panel timeline">
        ${items.length ? items.map((item) => `
          <div class="timeline-item">
            <strong>${escapeHtml(item.event_type.replaceAll("_", " "))}</strong>
            <span>${escapeHtml(item.detail)}</span>
            <small class="muted">${new Date(item.created_at).toLocaleString()}</small>
          </div>
        `).join("") : statusBlock(t("timeline.emptyTitle"), t("timeline.emptyBody"), `<a class="btn btn-primary" href="#dashboard">${escapeHtml(t("timeline.openLibrary"))}</a>`)}
      </div>
    </section>
  `;
}
