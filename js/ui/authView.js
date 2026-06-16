import { genreLabel, t } from "../core/i18n.js";
import { escapeHtml } from "./components/emptyStates.js";

export function renderAuthView(state) {
  const signup = state.route.query.mode === "signup";
  const needsProfile = state.needsProfile && state.user;
  if (needsProfile) {
    return `
      <main class="auth-card panel">
        <span class="section-kicker">${escapeHtml(t("auth.completeSetup"))}</span>
        <h1>${escapeHtml(t("auth.prepareLibrary"))}</h1>
        <p class="muted">${escapeHtml(t("auth.profileIntro"))}</p>
        <form class="form-grid" data-form="complete-profile">
          <div class="field"><label for="displayName">${escapeHtml(t("auth.displayName"))}</label><input id="displayName" name="displayName" required value="${escapeHtml(state.user.email?.split("@")[0] || "Storyteller")}"></div>
          <div class="field"><label for="favoriteGenre">${escapeHtml(t("auth.favoriteGenre"))}</label><select id="favoriteGenre" name="favoriteGenre">${genreOptions(state.genres)}</select></div>
          <button class="btn btn-primary" type="submit">${escapeHtml(t("auth.createProfile"))}</button>
        </form>
      </main>
    `;
  }

  return `
    <main class="auth-card panel">
      <span class="section-kicker">${escapeHtml(signup ? t("auth.newLibrary") : t("auth.welcomeBack"))}</span>
      <h1>${escapeHtml(signup ? t("auth.createAccount") : t("auth.signIn"))}</h1>
      <form class="form-grid" data-form="auth" data-mode="${signup ? "signup" : "signin"}">
        ${signup ? `<div class="field"><label for="displayName">${escapeHtml(t("auth.displayName"))}</label><input id="displayName" name="displayName" autocomplete="name" required></div>` : ""}
        <div class="field"><label for="email">${escapeHtml(t("auth.email"))}</label><input id="email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="password">${escapeHtml(t("auth.password"))}</label><input id="password" name="password" type="password" autocomplete="${signup ? "new-password" : "current-password"}" minlength="6" required></div>
        <button class="btn btn-primary" type="submit">${escapeHtml(signup ? t("auth.createAccount") : t("auth.signIn"))}</button>
      </form>
      <p class="trust-note">${escapeHtml(t("auth.trust"))}</p>
      <p class="muted">${signup ? `${escapeHtml(t("auth.hasAccount"))} <a href="#auth">${escapeHtml(t("auth.signIn"))}</a>.` : `${escapeHtml(t("auth.needsAccount"))} <a href="#auth?mode=signup">${escapeHtml(t("auth.createAnAccount"))}</a>.`}</p>
    </main>
  `;
}

function genreOptions(genres = []) {
  return genres.map((genre) => `<option value="${escapeHtml(genre.key)}">${escapeHtml(genreLabel(genre.key) || genre.label)}</option>`).join("");
}
