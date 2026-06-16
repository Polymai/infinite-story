import { appDb } from "./supabaseClient.js";

export async function loadInventory() {
  const { data, error } = await appDb.from("inventory_items").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function loadAchievements() {
  const { error: syncError } = await appDb.rpc("sync_player_rewards");
  if (syncError) {
    console.warn("Reward sync skipped", syncError.message);
  }

  const [{ data: achievements, error: allError }, { data: unlocked, error: unlockedError }] = await Promise.all([
    appDb.from("achievements").select("*").order("sort_order", { ascending: true }),
    appDb.from("user_achievements").select("*"),
  ]);
  if (allError) throw allError;
  if (unlockedError) throw unlockedError;
  const unlockedMap = new Map((unlocked || []).map((item) => [item.achievement_key, item]));
  return (achievements || []).map((achievement) => ({ ...achievement, unlocked: unlockedMap.has(achievement.achievement_key) }));
}

export async function loadStats() {
  const { data, error } = await appDb.from("stats").select("*").maybeSingle();
  if (error) throw error;
  return data || { stories_created: 0, chapters_generated: 0, choices_made: 0, items_found: 0, xp: 0, level: 1, title: "Wanderer" };
}
