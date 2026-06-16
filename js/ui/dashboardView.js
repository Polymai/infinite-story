import { audienceLabel, genreLabel, storyLanguageLabel, storyStatusLabel, t } from "../core/i18n.js";
import { escapeHtml, statusBlock } from "./components/emptyStates.js";

export function renderDashboardView(state) {
  const stories = state.stories || [];
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">${escapeHtml(t("dashboard.kicker"))}</span>
          <h1 class="view-title">${escapeHtml(t("dashboard.title"))}</h1>
          <p>${escapeHtml(t("dashboard.body"))}</p>
        </div>
        <a class="btn btn-primary" href="#create">${escapeHtml(t("dashboard.newStory"))}</a>
      </header>
      <div class="grid-3">
        <div class="metric"><strong>${stories.length}</strong><span>${escapeHtml(t("dashboard.stories"))}</span></div>
        <div class="metric"><strong>${state.stats?.chapters_generated || 0}</strong><span>${escapeHtml(t("dashboard.chapters"))}</span></div>
        <div class="metric"><strong>${state.inventory?.length || 0}</strong><span>${escapeHtml(t("dashboard.items"))}</span></div>
      </div>
      <div class="story-list">
        ${stories.length ? stories.map((story) => `
          <article class="card story-card">
            <header>
              <div>
                <h3>${escapeHtml(story.title)}</h3>
                <span class="muted">${escapeHtml(genreLabel(story.genre))} · ${escapeHtml(storyLanguageLabel(story.language))} · ${escapeHtml(audienceLabel(story.audience))} · ${escapeHtml(storyStatusLabel(story.status))}</span>
              </div>
              <a class="btn btn-ghost" href="#story/${story.id}">${escapeHtml(t("dashboard.open"))}</a>
            </header>
            <p>${escapeHtml(story.premise)}</p>
          </article>
        `).join("") : statusBlock(t("dashboard.emptyTitle"), t("dashboard.emptyBody"), `<a class="btn btn-primary" href="#create">${escapeHtml(t("dashboard.createStory"))}</a>`)}
      </div>
    </section>
  `;
}
