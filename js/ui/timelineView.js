import { escapeHtml, statusBlock } from "./components/emptyStates.js";

export function renderTimelineView(state) {
  const items = state.timeline || [];
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">Timeline</span>
          <h1 class="view-title">Remembered events</h1>
          <p>Every important branch and generated chapter is kept in order for the active story.</p>
        </div>
      </header>
      <div class="panel timeline">
        ${items.length ? items.map((item) => `
          <div class="timeline-item">
            <strong>${escapeHtml(item.event_type.replaceAll("_", " "))}</strong>
            <span>${escapeHtml(item.detail)}</span>
            <small class="muted">${new Date(item.created_at).toLocaleString()}</small>
          </div>
        `).join("") : statusBlock("No active timeline", "Open a story from the library to review its remembered events.", '<a class="btn btn-primary" href="#dashboard">Open library</a>')}
      </div>
    </section>
  `;
}
