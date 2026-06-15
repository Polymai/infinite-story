import { saveProfile } from "./profileService.js";
import { writeLocal } from "../core/storageKeys.js";

export async function saveSettings(userId, form) {
  writeLocal("ui-preferences", { theme: form.theme, reducedMotion: Boolean(form.reducedMotion) });
  return await saveProfile(userId, {
    display_name: String(form.displayName || "Storyteller").trim().slice(0, 80),
    favorite_genre: String(form.favoriteGenre || "fantasy"),
    pace: String(form.pace || "balanced"),
    theme: String(form.theme || "system"),
    reduced_motion: Boolean(form.reducedMotion),
  });
}
