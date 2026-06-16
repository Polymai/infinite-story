import { genreLabel, storyLanguageLabel, t } from "../core/i18n.js";
import { escapeHtml } from "./components/emptyStates.js";

export function renderCreateStoryView(state) {
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">${escapeHtml(t("create.kicker"))}</span>
          <h1 class="view-title">${escapeHtml(t("create.title"))}</h1>
          <p>${escapeHtml(t("create.body"))}</p>
        </div>
      </header>
      <form class="panel form-grid" data-form="create-story">
        <div class="field">
          <label for="title">${escapeHtml(t("create.storyTitle"))}</label>
          <input id="title" name="title" required maxlength="120" placeholder="${escapeHtml(t("create.placeholderTitle"))}">
        </div>
        <div class="grid-2">
          <div class="field">
            <label for="genre">${escapeHtml(t("create.genre"))}</label>
            <select id="genre" name="genre">${state.genres.map((genre) => `<option value="${escapeHtml(genre.key)}">${escapeHtml(genreLabel(genre.key) || genre.label)}</option>`).join("")}</select>
          </div>
          <div class="field">
            <label for="language">${escapeHtml(t("create.storyLanguage"))}</label>
            <select id="language" name="language">
              <option value="en">${escapeHtml(storyLanguageLabel("en"))}</option>
              <option value="sv" selected>${escapeHtml(storyLanguageLabel("sv"))}</option>
              <option value="es">${escapeHtml(storyLanguageLabel("es"))}</option>
              <option value="fr">${escapeHtml(storyLanguageLabel("fr"))}</option>
              <option value="de">${escapeHtml(storyLanguageLabel("de"))}</option>
            </select>
          </div>
        </div>
        <div class="grid-2">
          <div class="field">
            <label for="audience">${escapeHtml(t("create.audience"))}</label>
            <select id="audience" name="audience">
              <option value="middle-grade">${escapeHtml(t("audience.middleGrade"))}</option>
              <option value="young-adult">${escapeHtml(t("audience.youngAdult"))}</option>
              <option value="adult" selected>${escapeHtml(t("audience.adult"))}</option>
              <option value="all-ages">${escapeHtml(t("audience.allAges"))}</option>
            </select>
          </div>
          <div class="field">
            <label for="tone">${escapeHtml(t("create.tone"))}</label>
            <select id="tone" name="tone">
              <option value="cinematic">${escapeHtml(t("tone.cinematic"))}</option>
              <option value="quiet">${escapeHtml(t("tone.quiet"))}</option>
              <option value="tense">${escapeHtml(t("tone.tense"))}</option>
              <option value="playful">${escapeHtml(t("tone.playful"))}</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label for="premise">${escapeHtml(t("create.premise"))}</label>
          <textarea id="premise" name="premise" required maxlength="1200" placeholder="${escapeHtml(t("create.placeholderPremise"))}"></textarea>
        </div>
        <button class="btn btn-primary" type="submit">${escapeHtml(t("create.submit"))}</button>
      </form>
    </section>
  `;
}
