import { genreLabel, t } from "../core/i18n.js";
import { escapeHtml } from "./components/emptyStates.js";

export function renderSettingsView(state) {
  const profile = state.profile || {};
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">${escapeHtml(t("settings.kicker"))}</span>
          <h1 class="view-title">${escapeHtml(t("settings.title"))}</h1>
          <p>${escapeHtml(t("settings.body"))}</p>
        </div>
      </header>
      <form class="panel form-grid" data-form="settings">
        <div class="field"><label for="displayName">${escapeHtml(t("auth.displayName"))}</label><input id="displayName" name="displayName" value="${escapeHtml(profile.display_name || "")}" required></div>
        <div class="grid-2">
          <div class="field"><label for="favoriteGenre">${escapeHtml(t("auth.favoriteGenre"))}</label><select id="favoriteGenre" name="favoriteGenre">${state.genres.map((genre) => `<option value="${escapeHtml(genre.key)}" ${profile.favorite_genre === genre.key ? "selected" : ""}>${escapeHtml(genreLabel(genre.key) || genre.label)}</option>`).join("")}</select></div>
          <div class="field"><label for="pace">${escapeHtml(t("settings.pace"))}</label><select id="pace" name="pace"><option value="brisk" ${profile.pace === "brisk" ? "selected" : ""}>${escapeHtml(t("settings.brisk"))}</option><option value="balanced" ${profile.pace === "balanced" ? "selected" : ""}>${escapeHtml(t("settings.balanced"))}</option><option value="lingering" ${profile.pace === "lingering" ? "selected" : ""}>${escapeHtml(t("settings.lingering"))}</option></select></div>
        </div>
        <div class="settings-row">
          <div><strong>${escapeHtml(t("settings.reducedMotion"))}</strong><div class="muted">${escapeHtml(t("settings.reducedMotionBody"))}</div></div>
          <input type="checkbox" name="reducedMotion" ${profile.reduced_motion ? "checked" : ""}>
        </div>
        <input type="hidden" name="theme" value="${escapeHtml(profile.theme || "system")}">
        <button class="btn btn-primary" type="submit">${escapeHtml(t("settings.save"))}</button>
      </form>
    </section>
  `;
}
