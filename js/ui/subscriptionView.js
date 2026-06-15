import { escapeHtml } from "./components/emptyStates.js";

export function renderSubscriptionView(state) {
  const active = state.subscription?.plan_key || "free";
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">Billing</span>
          <h1 class="view-title">Plans and access</h1>
          <p>Checkout and billing management run through the server-side Supabase Edge Function and Stripe webhooks.</p>
        </div>
        <button class="btn btn-ghost" type="button" data-action="billing-portal">Manage billing</button>
      </header>
      <div class="grid-3">
        ${(state.plans || []).map((plan) => `
          <article class="card plan-card ${plan.plan_key === "creator" ? "is-featured" : ""}">
            <span class="pill">${plan.plan_key === active ? "Current" : "Plan"}</span>
            <h3>${escapeHtml(plan.name)}</h3>
            <strong>${escapeHtml(plan.price_label)}</strong>
            <p>${escapeHtml(plan.description)}</p>
            <p class="muted">${plan.monthly_story_limit} stories · ${plan.monthly_chapter_limit} chapters/month</p>
            ${plan.plan_key === "free" || plan.plan_key === active
              ? '<button class="btn btn-ghost" type="button" disabled>Selected</button>'
              : `<button class="btn btn-primary" type="button" data-action="checkout" data-plan-key="${escapeHtml(plan.plan_key)}">Upgrade</button>`}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}
