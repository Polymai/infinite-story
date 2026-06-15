import { escapeHtml, statusBlock } from "./components/emptyStates.js";

export function renderDashboardView(state) {
  const stories = state.stories || [];
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">Your library</span>
          <h1 class="view-title">Story worlds</h1>
          <p>Pick up a chapter, review recent branches, or open a new world.</p>
        </div>
        <a class="btn btn-primary" href="#create">New story</a>
      </header>
      <div class="grid-3">
        <div class="metric"><strong>${stories.length}</strong><span>stories</span></div>
        <div class="metric"><strong>${state.stats?.chapters_generated || 0}</strong><span>chapters</span></div>
        <div class="metric"><strong>${state.inventory?.length || 0}</strong><span>items</span></div>
      </div>
      <div class="story-list">
        ${stories.length ? stories.map((story) => `
          <article class="card story-card">
            <header>
              <div>
                <h3>${escapeHtml(story.title)}</h3>
                <span class="muted">${escapeHtml(story.genre)} · ${escapeHtml(story.status)}</span>
              </div>
              <a class="btn btn-ghost" href="#story/${story.id}">Open</a>
            </header>
            <p>${escapeHtml(story.premise)}</p>
          </article>
        `).join("") : statusBlock("No stories yet", "Create your first world and the opening chapter will be saved to your private library.", '<a class="btn btn-primary" href="#create">Create a story</a>')}
      </div>
    </section>
  `;
}
