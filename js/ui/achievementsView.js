import { t, translatedAchievement } from "../core/i18n.js";
import { escapeHtml } from "./components/emptyStates.js";

export function renderAchievementsView(state) {
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">${escapeHtml(t("achievements.kicker"))}</span>
          <h1 class="view-title">${escapeHtml(t("achievements.title"))}</h1>
          <p>${escapeHtml(t("achievements.body"))}</p>
        </div>
      </header>
      <div class="achievement-grid">
        ${(state.achievements || []).map((achievement) => {
          const translated = translatedAchievement(achievement);
          return `
            <article class="card ${achievement.unlocked ? "unlock" : ""}">
              <span class="pill">${escapeHtml(achievement.unlocked ? t("achievements.unlocked") : t("achievements.locked"))}</span>
              <h3>${escapeHtml(translated.name)}</h3>
              <p>${escapeHtml(translated.description)}</p>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}
