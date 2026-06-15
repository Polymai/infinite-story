import { appDb } from "./supabaseClient.js";

export async function loadProfile(userId) {
  const { data, error } = await appDb.from("profiles").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function completeProfile(user, form) {
  const displayName = String(form.displayName || user.email?.split("@")[0] || "Storyteller").trim().slice(0, 80);
  const { data, error } = await appDb.from("profiles").upsert({
    user_id: user.id,
    display_name: displayName,
    favorite_genre: String(form.favoriteGenre || "fantasy"),
    pace: String(form.pace || "balanced"),
    theme: String(form.theme || "system"),
    reduced_motion: Boolean(form.reducedMotion),
  }, { onConflict: "user_id" }).select("*").single();
  if (error) throw error;

  await appDb.from("stats").upsert({ user_id: user.id }, { onConflict: "user_id" });
  await appDb.from("subscriptions").upsert({
    user_id: user.id,
    plan_key: "free",
    status: "free",
  });
  return data;
}

export async function saveProfile(userId, patch) {
  const { data, error } = await appDb.from("profiles").update(patch).eq("user_id", userId).select("*").single();
  if (error) throw error;
  return data;
}
