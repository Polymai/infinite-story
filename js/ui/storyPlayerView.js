import { escapeHtml, statusBlock } from "./components/emptyStates.js";
import { renderChoiceCards } from "./components/choiceCards.js";
import { renderTypewriterText } from "./components/typewriter.js";

export function renderStoryPlayerView(state) {
  const story = state.selectedStory;
  const chapters = state.chapters || [];
  const current = chapters[chapters.length - 1];
  if (!story) {
    return `<section class="view-shell">${statusBlock("Story not found", "Open a story from your library or create a new one.", '<a class="btn btn-primary" href="#dashboard">Back to library</a>')}</section>`;
  }
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">${escapeHtml(story.genre)}</span>
          <h1 class="view-title">${escapeHtml(story.title)}</h1>
          <p>${escapeHtml(story.premise)}</p>
        </div>
        <div class="topbar-actions">
          <a class="btn btn-ghost" href="#timeline">Timeline</a>
          <button class="btn btn-danger" type="button" data-action="delete-story" data-story-id="${story.id}">Delete</button>
        </div>
      </header>
      ${current ? `
        <article class="panel chapter-reader">
          <span class="pill">Chapter ${current.chapter_number}</span>
          <h2>${escapeHtml(current.title)}</h2>
          ${renderTypewriterText(current.body)}
          <div class="stack">
            <h3>Choose the next turn</h3>
            ${renderChoiceCards(current.choices || [])}
          </div>
        </article>
      ` : statusBlock("No chapters", "This story has no saved chapters yet.")}
    </section>
  `;
}
