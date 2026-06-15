import { appAction } from "./supabaseClient.js";

export async function continueStory(storyId, selectedChoice) {
  return await appAction("continue-story", { storyId, selectedChoice });
}
