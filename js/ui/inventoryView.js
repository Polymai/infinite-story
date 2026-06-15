import { escapeHtml, statusBlock } from "./components/emptyStates.js";

export function renderInventoryView(state) {
  const items = state.inventory || [];
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">Inventory</span>
          <h1 class="view-title">Story items</h1>
          <p>Rewards and clues discovered through generated continuations appear here.</p>
        </div>
      </header>
      <div class="inventory-grid">
        ${items.length ? items.map((item) => `
          <article class="card">
            <span class="pill">${escapeHtml(item.rarity)}</span>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.description || "A remembered object from one of your stories.")}</p>
          </article>
        `).join("") : statusBlock("No items yet", "Continue a story and rare clues can be added by the AI engine.")}
      </div>
    </section>
  `;
}
