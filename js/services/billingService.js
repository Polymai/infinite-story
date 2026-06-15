import { appDb, appAction } from "./supabaseClient.js";

export async function loadBilling() {
  const [{ data: plans, error: planError }, { data: subscription, error: subError }] = await Promise.all([
    appDb.from("plans").select("*").order("sort_order", { ascending: true }),
    appDb.from("subscriptions").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (planError) throw planError;
  if (subError) throw subError;
  return { plans: plans || [], subscription };
}

export async function startCheckout(planKey) {
  const body = await appAction("create-checkout-session", { planKey, origin: window.location.origin + window.location.pathname });
  if (body.url) window.location.href = body.url;
  return body;
}

export async function openBillingPortal() {
  const body = await appAction("create-billing-portal", { origin: window.location.origin + window.location.pathname });
  if (body.url) window.location.href = body.url;
  return body;
}
