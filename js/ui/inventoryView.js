import { t } from "../core/i18n.js";
import { escapeHtml, statusBlock } from "./components/emptyStates.js";

function rarityClass(value) {
  return String(value || "common").toLowerCase().replace(/[^a-z0-9_-]/g, "");
}

export function renderInventoryView(state) {
  const items = state.inventory || [];
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">${escapeHtml(t("inventory.kicker"))}</span>
          <h1 class="view-title">${escapeHtml(t("inventory.title"))}</h1>
          <p>${escapeHtml(t("inventory.body"))}</p>
        </div>
      </header>
      <div class="inventory-grid">
        ${items.length ? items.map((item) => `
          <article class="card item-card rarity-${rarityClass(item.rarity)}">
            <div class="item-card-head">
              <span class="pill">${escapeHtml(item.rarity || t("inventory.common"))}</span>
              <span class="item-type">${escapeHtml(item.item_type || t("inventory.relic"))}</span>
            </div>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.description || t("inventory.fallback"))}</p>
          </article>
        `).join("") : statusBlock(t("inventory.emptyTitle"), t("inventory.emptyBody"))}
      </div>
    </section>
  `;
}
