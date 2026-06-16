import { t, translatedPlan } from "../core/i18n.js";
import { escapeHtml } from "./components/emptyStates.js";

const usageRules = {
  free: { dailyLimit: 3, cooldownKey: "billing.cooldown30" },
  creator: { dailyLimit: 10, cooldownKey: "billing.cooldown10" },
  studio: { dailyLimit: 30, cooldownKey: "billing.cooldown3" },
};

export function renderSubscriptionView(state) {
  const active = state.subscription?.plan_key || "free";
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">${escapeHtml(t("billing.kicker"))}</span>
          <h1 class="view-title">${escapeHtml(t("billing.title"))}</h1>
          <p>${escapeHtml(t("billing.body"))}</p>
        </div>
        <button class="btn btn-ghost" type="button" data-action="billing-portal">${escapeHtml(t("billing.manage"))}</button>
      </header>
      <div class="grid-3">
        ${(state.plans || []).map((plan) => {
          const display = translatedPlan(plan);
          const rule = usageRules[plan.plan_key] || usageRules.free;
          return `
            <article class="card plan-card ${plan.plan_key === "creator" ? "is-featured" : ""}">
              <span class="pill">${escapeHtml(plan.plan_key === active ? t("billing.current") : t("billing.plan"))}</span>
              <h3>${escapeHtml(display.name)}</h3>
              <strong>${escapeHtml(plan.price_label)}</strong>
              <p>${escapeHtml(display.description)}</p>
              <p class="muted">${escapeHtml(t("billing.usage", { limit: rule.dailyLimit, cooldown: t(rule.cooldownKey) }))}</p>
              <p class="muted">${escapeHtml(t("billing.monthly", { stories: plan.monthly_story_limit, chapters: plan.monthly_chapter_limit }))}</p>
              ${plan.plan_key === "free" || plan.plan_key === active
                ? `<button class="btn btn-ghost" type="button" disabled>${escapeHtml(t("billing.selected"))}</button>`
                : `<button class="btn btn-primary" type="button" data-action="checkout" data-plan-key="${escapeHtml(plan.plan_key)}">${escapeHtml(t("billing.upgrade"))}</button>`}
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}
