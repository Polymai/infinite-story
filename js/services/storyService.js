import { appDb } from "./supabaseClient.js";

function firstChapterBody({ title, genre, premise }) {
  return [
    `${title} begins with a choice already waiting in the air.`,
    `The world is ${genre}, but it does not behave like a genre. It breathes, answers, and keeps score. ${premise}`,
    "Something small changes first: a sound behind a closed door, a message in a margin, a light where there should be no light. You understand at once that the next step will make the story remember you.",
  ].join("\n\n");
}

function starterChoices() {
  return [
    { label: "Enter quietly", text: "Move forward without disturbing the scene." },
    { label: "Ask a question", text: "Call out and see who answers." },
    { label: "Take the clue", text: "Claim the strange object before anyone notices." },
  ];
}

export async function loadStories() {
  const { data, error } = await appDb.from("stories").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createStory(input) {
  const title = String(input.title || "Untitled story").trim().slice(0, 120);
  const genre = String(input.genre || "fantasy");
  const premise = String(input.premise || "").trim().slice(0, 1200);
  const tone = String(input.tone || "cinematic");
  const { data, error } = await appDb.rpc("create_story_with_first_chapter", {
    p_title: title,
    p_genre: genre,
    p_premise: premise,
    p_tone: tone,
    p_body: firstChapterBody({ title, genre, premise }),
    p_choices: starterChoices(),
  });
  if (error) throw error;
  return data;
}

export async function loadStoryBundle(storyId) {
  const [{ data: story, error: storyError }, { data: chapters, error: chapterError }, { data: events, error: eventError }] = await Promise.all([
    appDb.from("stories").select("*").eq("id", storyId).maybeSingle(),
    appDb.from("chapters").select("*").eq("story_id", storyId).order("chapter_number", { ascending: true }),
    appDb.from("story_events").select("*").eq("story_id", storyId).order("created_at", { ascending: true }),
  ]);
  if (storyError) throw storyError;
  if (chapterError) throw chapterError;
  if (eventError) throw eventError;
  return { story, chapters: chapters || [], timeline: events || [] };
}

export async function deleteStory(storyId) {
  const { error } = await appDb.from("stories").delete().eq("id", storyId);
  if (error) throw error;
}
