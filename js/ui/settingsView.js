import { escapeHtml } from "./components/emptyStates.js";

export function renderSettingsView(state) {
  const profile = state.profile || {};
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">Settings</span>
          <h1 class="view-title">Reader preferences</h1>
          <p>These settings are stored in the app-local profile table, separate from shared Supabase auth.</p>
        </div>
      </header>
      <form class="panel form-grid" data-form="settings">
        <div class="field"><label for="displayName">Display name</label><input id="displayName" name="displayName" value="${escapeHtml(profile.display_name || "")}" required></div>
        <div class="grid-2">
          <div class="field"><label for="favoriteGenre">Favorite genre</label><select id="favoriteGenre" name="favoriteGenre">${state.genres.map((genre) => `<option value="${escapeHtml(genre.key)}" ${profile.favorite_genre === genre.key ? "selected" : ""}>${escapeHtml(genre.label)}</option>`).join("")}</select></div>
          <div class="field"><label for="pace">Pace</label><select id="pace" name="pace"><option value="brisk" ${profile.pace === "brisk" ? "selected" : ""}>Brisk</option><option value="balanced" ${profile.pace === "balanced" ? "selected" : ""}>Balanced</option><option value="lingering" ${profile.pace === "lingering" ? "selected" : ""}>Lingering</option></select></div>
        </div>
        <div class="settings-row">
          <div><strong>Reduced motion</strong><div class="muted">Minimize animated view transitions.</div></div>
          <input type="checkbox" name="reducedMotion" ${profile.reduced_motion ? "checked" : ""}>
        </div>
        <input type="hidden" name="theme" value="${escapeHtml(profile.theme || "system")}">
        <button class="btn btn-primary" type="submit">Save settings</button>
      </form>
    </section>
  `;
}
