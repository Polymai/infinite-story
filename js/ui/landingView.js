import { t } from "../core/i18n.js";
import { escapeHtml } from "./components/emptyStates.js";

export function renderLandingView() {
  return `
    <main class="hero">
      <section class="hero-copy">
        <span class="section-kicker">${escapeHtml(t("landing.kicker"))}</span>
        <h1 class="display-title">Infinite Story</h1>
        <p>${escapeHtml(t("landing.body"))}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#auth?mode=signup">${escapeHtml(t("landing.begin"))}</a>
          <a class="btn btn-ghost" href="#auth">${escapeHtml(t("landing.signIn"))}</a>
        </div>
        <div class="hero-examples" aria-label="${escapeHtml(t("landing.examples"))}">
          <article class="prompt-card">
            <span>${escapeHtml(t("landing.ex1Kicker"))}</span>
            <strong>${escapeHtml(t("landing.ex1Title"))}</strong>
            <p>${escapeHtml(t("landing.ex1Body"))}</p>
          </article>
          <article class="prompt-card">
            <span>${escapeHtml(t("landing.ex2Kicker"))}</span>
            <strong>${escapeHtml(t("landing.ex2Title"))}</strong>
            <p>${escapeHtml(t("landing.ex2Body"))}</p>
          </article>
          <article class="prompt-card">
            <span>${escapeHtml(t("landing.ex3Kicker"))}</span>
            <strong>${escapeHtml(t("landing.ex3Title"))}</strong>
            <p>${escapeHtml(t("landing.ex3Body"))}</p>
          </article>
        </div>
      </section>
      <span aria-hidden="true"></span>
    </main>
  `;
}
