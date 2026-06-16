import { appAction } from "./supabaseClient.js";

const CHAPTER_GENERATION_TIMEOUT_MS = 45000;

export async function continueStory(storyId, selectedChoice, currentChapterId = null) {
  try {
    return await appAction("continue-story", { storyId, selectedChoice, currentChapterId }, { timeoutMs: CHAPTER_GENERATION_TIMEOUT_MS });
  } catch (error) {
    if (error?.code === "timeout") {
      throw new Error("Chapter generation took too long. Try again in a moment, or refresh the story to check if it finished.");
    }
    throw error;
  }
}

export async function getUsageStatus() {
  const result = await appAction("get-usage-status");
  return result.usage;
}
