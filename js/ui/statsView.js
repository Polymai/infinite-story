export function renderStatsView(state) {
  const stats = state.stats || {};
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">Stats</span>
          <h1 class="view-title">Writing rhythm</h1>
          <p>Operational counters for stories, generated chapters, choices, and discoveries.</p>
        </div>
      </header>
      <div class="grid-3">
        <div class="metric"><strong>${stats.stories_created || 0}</strong><span>stories created</span></div>
        <div class="metric"><strong>${stats.chapters_generated || 0}</strong><span>chapters generated</span></div>
        <div class="metric"><strong>${stats.choices_made || 0}</strong><span>choices made</span></div>
      </div>
    </section>
  `;
}
