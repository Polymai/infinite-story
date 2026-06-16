import { getLocale, nextLocale, t } from "../core/i18n.js";
import { escapeHtml } from "./components/emptyStates.js";

const logoUrl = new URL("../../assets/logo.png", import.meta.url).href;

const navItems = [
  ["dashboard", "nav.library"],
  ["create", "nav.create"],
  ["inventory", "nav.items"],
  ["achievements", "nav.badges"],
  ["stats", "nav.stats"],
  ["billing", "nav.billing"],
  ["settings", "nav.settings"],
];

function brand() {
  return `
    <a class="brand" href="#home" aria-label="${escapeHtml(t("nav.home"))}">
      <img class="brand-logo" src="${logoUrl}" alt="Infinite Story">
    </a>
  `;
}

function navLinks(routeName, items) {
  return items.map(([name, labelKey]) => `
    <a class="nav-link ${routeName === name ? "is-active" : ""}" href="#${name}">${escapeHtml(t(labelKey))}</a>
  `).join("");
}

function nav(routeName) {
  return `
    <nav class="nav-list" aria-label="${escapeHtml(t("nav.main"))}">
      ${navLinks(routeName, navItems)}
    </nav>
  `;
}

function mobileFooterNav(routeName) {
  const primaryItems = navItems.slice(0, 5);
  const extraItems = navItems.slice(5);
  return `
    <details class="mobile-footer-menu">
      <summary aria-label="${escapeHtml(t("nav.more"))}">
        <span class="hamburger" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
        <span>${escapeHtml(t("nav.menu"))}</span>
      </summary>
      <nav class="mobile-more-nav" aria-label="${escapeHtml(t("nav.more"))}">
        ${navLinks(routeName, extraItems)}
      </nav>
    </details>
    <nav class="mobile-nav" aria-label="${escapeHtml(t("nav.mobile"))}">
      ${navLinks(routeName, primaryItems)}
    </nav>
  `;
}

export function renderPublicShell(content, mode = "public") {
  const locale = getLocale();
  const next = nextLocale();
  return `
    <div class="${mode === "auth" ? "auth-shell" : "public-shell"} route-view">
      <header class="topbar">
        ${brand()}
        <details class="header-menu">
          <summary aria-label="${escapeHtml(t("nav.openMenu"))}">
            <span class="hamburger" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span class="sr-only">${escapeHtml(t("nav.menu"))}</span>
          </summary>
          <div class="header-menu-panel">
            <button class="locale-toggle" type="button" data-action="toggle-locale" aria-label="${escapeHtml(t("nav.language"))}">
              <span>${escapeHtml(t("nav.language"))}</span>
              <strong>${escapeHtml(t(`lang.${locale}`))}</strong>
              <em>${escapeHtml(t(`lang.${next}`))}</em>
            </button>
            <a class="btn btn-ghost" href="#auth" aria-label="${escapeHtml(t("nav.signIn"))}">${escapeHtml(t("nav.signIn"))}</a>
            <a class="btn btn-primary" href="#auth?mode=signup" aria-label="${escapeHtml(t("nav.startStory"))}">${escapeHtml(t("nav.startStory"))}</a>
          </div>
        </details>
      </header>
      ${content}
    </div>
  `;
}

export function renderAppShell(state, content) {
  const name = state.profile?.display_name || state.user?.email || t("auth.storyteller");
  const stats = state.stats || {};
  const level = stats.level || 1;
  const xp = stats.xp || 0;
  const nextLevelXp = 150 * Math.pow(level, 2);
  const currentLevelXp = 150 * Math.pow(level - 1, 2);
  const levelPercent = Math.min(100, Math.round(((xp - currentLevelXp) / Math.max(1, nextLevelXp - currentLevelXp)) * 100));
  const playerTitle = stats.title === "Wanderer" || !stats.title ? t("stats.wanderer") : stats.title;
  const isChapterOverlay = state.overlayMessage === t("overlay.writingChapter");
  const locale = getLocale();
  const next = nextLocale();
  return `
    <div class="app-frame route-view">
      <aside class="sidebar">
        ${brand()}
        ${nav(state.route.name)}
        <div class="status">
          <strong>${escapeHtml(name)}</strong>
          <span>${escapeHtml(state.subscription?.plan_key || "free")} ${escapeHtml(t("billing.plan").toLowerCase())}</span>
          <a class="level-mini" href="#stats" aria-label="${escapeHtml(t("nav.stats"))}">
            <span>${escapeHtml(t("stats.level"))} ${level} ${escapeHtml(playerTitle)}</span>
            <em>${xp} XP</em>
            <i aria-hidden="true"><b style="width:${levelPercent}%"></b></i>
          </a>
          <button class="btn btn-ghost" type="button" data-action="sign-out">${escapeHtml(t("nav.signOut"))}</button>
        </div>
      </aside>
      <header class="mobile-bar">
        ${brand()}
        <details class="header-menu">
          <summary aria-label="${escapeHtml(t("nav.openAccount"))}">
            <span class="hamburger" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span class="sr-only">${escapeHtml(t("nav.menu"))}</span>
          </summary>
          <div class="header-menu-panel">
            <button class="locale-toggle" type="button" data-action="toggle-locale" aria-label="${escapeHtml(t("nav.language"))}">
              <span>${escapeHtml(t("nav.language"))}</span>
              <strong>${escapeHtml(t(`lang.${locale}`))}</strong>
              <em>${escapeHtml(t(`lang.${next}`))}</em>
            </button>
            <button class="btn btn-ghost" type="button" data-action="sign-out">${escapeHtml(t("nav.signOut"))}</button>
          </div>
        </details>
      </header>
      <main class="main-panel">
        ${content}
      </main>
      <footer class="mobile-footer" aria-label="${escapeHtml(t("nav.mobile"))}">
        ${mobileFooterNav(state.route.name)}
      </footer>
      ${state.overlayMessage ? `
        <div class="loader-overlay" role="status" aria-busy="true">
          <div class="loader-box">
            <div class="loader-head">
              <span class="hourglass" aria-hidden="true"></span>
              <div>
                <strong>${escapeHtml(state.overlayMessage)}</strong>
                <span class="loader-step">${isChapterOverlay ? escapeHtml(t("overlay.drafting")) : escapeHtml(t("overlay.working"))}</span>
              </div>
            </div>
            <div class="progress-track" aria-hidden="true">
              <span class="progress-fill"></span>
            </div>
            <div class="progress-meta">
              <span>${isChapterOverlay ? escapeHtml(t("overlay.chapterWait")) : escapeHtml(t("overlay.pleaseWait"))}</span>
              <span class="progress-percent"></span>
            </div>
          </div>
        </div>
      ` : ""}
    </div>
  `;
}
