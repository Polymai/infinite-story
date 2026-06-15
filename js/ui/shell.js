import { escapeHtml } from "./components/emptyStates.js";

const navItems = [
  ["dashboard", "Library"],
  ["create", "Create"],
  ["inventory", "Items"],
  ["achievements", "Badges"],
  ["billing", "Billing"],
  ["settings", "Settings"],
];

function brand() {
  return `
    <a class="brand" href="#home" aria-label="Infinite Story home">
      <span class="brand-mark" aria-hidden="true">IS</span>
      <span class="brand-word"><strong>Infinite Story</strong><span>living fiction</span></span>
    </a>
  `;
}

function nav(routeName, mobile = false) {
  const items = mobile ? navItems.slice(0, 5) : navItems;
  return `
    <nav class="${mobile ? "mobile-nav" : "nav-list"}" aria-label="${mobile ? "Mobile" : "Main"} navigation">
      ${items.map(([name, label]) => `
        <a class="nav-link ${routeName === name ? "is-active" : ""}" href="#${name}">${escapeHtml(label)}</a>
      `).join("")}
    </nav>
  `;
}

export function renderPublicShell(content, mode = "public") {
  return `
    <div class="${mode === "auth" ? "auth-shell" : "public-shell"} route-view">
      <header class="topbar">
        ${brand()}
        <div class="topbar-actions">
          <a class="btn btn-ghost" href="#auth">Sign in</a>
          <a class="btn btn-primary" href="#auth?mode=signup">Start a story</a>
        </div>
      </header>
      ${content}
    </div>
  `;
}

export function renderAppShell(state, content) {
  const name = state.profile?.display_name || state.user?.email || "Storyteller";
  return `
    <div class="app-frame route-view">
      <aside class="sidebar">
        ${brand()}
        ${nav(state.route.name)}
        <div class="status">
          <strong>${escapeHtml(name)}</strong>
          <span>${escapeHtml(state.subscription?.plan_key || "free")} plan</span>
          <button class="btn btn-ghost" type="button" data-action="sign-out">Sign out</button>
        </div>
      </aside>
      <header class="mobile-bar">
        ${brand()}
        <button class="btn btn-ghost" type="button" data-action="sign-out">Sign out</button>
      </header>
      <main class="main-panel">
        ${content}
      </main>
      ${nav(state.route.name, true)}
      ${state.overlayMessage ? `
        <div class="loader-overlay" role="status" aria-busy="true">
          <div class="loader-box">
            <strong>${escapeHtml(state.overlayMessage)}</strong>
            <span class="muted">This can take a moment.</span>
          </div>
        </div>
      ` : ""}
    </div>
  `;
}
