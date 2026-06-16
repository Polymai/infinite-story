import { t } from "../core/i18n.js";
import { escapeHtml } from "./components/emptyStates.js";

function levelProgress(xp = 0, level = 1) {
  const currentLevel = Math.max(1, Number(level) || 1);
  const currentFloor = 150 * Math.pow(currentLevel - 1, 2);
  const nextFloor = 150 * Math.pow(currentLevel, 2);
  const earned = Math.max(0, Number(xp) - currentFloor);
  const needed = Math.max(1, nextFloor - currentFloor);
  return {
    currentFloor,
    nextFloor,
    percent: Math.min(100, Math.round((earned / needed) * 100)),
    remaining: Math.max(0, nextFloor - Number(xp || 0)),
  };
}

export function renderStatsView(state) {
  const stats = state.stats || {};
  const progress = levelProgress(stats.xp, stats.level);
  const title = stats.title === "Wanderer" || !stats.title ? t("stats.wanderer") : stats.title;
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">${escapeHtml(t("stats.kicker"))}</span>
          <h1 class="view-title">${escapeHtml(t("stats.level"))} ${stats.level || 1}: ${escapeHtml(title)}</h1>
          <p>${escapeHtml(t("stats.body"))}</p>
        </div>
      </header>
      <article class="panel level-panel">
        <div>
          <span class="section-kicker">${stats.xp || 0} XP</span>
          <h2>${escapeHtml(t("stats.toNext", { xp: progress.remaining }))}</h2>
        </div>
        <div class="level-track" aria-hidden="true"><span style="width:${progress.percent}%"></span></div>
      </article>
      <div class="grid-3">
        <div class="metric"><strong>${stats.stories_created || 0}</strong><span>${escapeHtml(t("stats.storiesCreated"))}</span></div>
        <div class="metric"><strong>${stats.chapters_generated || 0}</strong><span>${escapeHtml(t("stats.chaptersGenerated"))}</span></div>
        <div class="metric"><strong>${stats.choices_made || 0}</strong><span>${escapeHtml(t("stats.choicesMade"))}</span></div>
        <div class="metric"><strong>${stats.items_found || 0}</strong><span>${escapeHtml(t("stats.itemsFound"))}</span></div>
      </div>
    </section>
  `;
}
