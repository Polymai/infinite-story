import { escapeHtml } from "./components/emptyStates.js";

export function renderAchievementsView(state) {
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">Achievements</span>
          <h1 class="view-title">Milestones</h1>
          <p>Track durable progress across your private story library.</p>
        </div>
      </header>
      <div class="achievement-grid">
        ${(state.achievements || []).map((achievement) => `
          <article class="card ${achievement.unlocked ? "unlock" : ""}">
            <span class="pill">${achievement.unlocked ? "Unlocked" : "Locked"}</span>
            <h3>${escapeHtml(achievement.name)}</h3>
            <p>${escapeHtml(achievement.description)}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}
