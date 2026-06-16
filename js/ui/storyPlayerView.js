import { audienceLabel, genreLabel, storyLanguageLabel, t } from "../core/i18n.js";
import { escapeHtml, statusBlock } from "./components/emptyStates.js";
import { renderChoiceCards } from "./components/choiceCards.js";
import { renderTypewriterText } from "./components/typewriter.js";

function formatCooldown(seconds = 0) {
  const value = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(value / 60);
  const rest = value % 60;
  return minutes > 0 ? `${minutes}m ${String(rest).padStart(2, "0")}s` : `${rest}s`;
}

function renderUsageMeter(usage) {
  if (!usage) return "";
  const used = Number(usage.usedToday || 0);
  const limit = Number(usage.dailyLimit || 0);
  const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const blocked = !usage.allowed;
  const message = usage.reason === "daily_limit"
    ? t("story.dailyLimit")
    : blocked
      ? t("story.nextUnlock", { time: formatCooldown(usage.cooldownRemainingSeconds) })
      : t("story.ready");
  return `
    <div class="usage-meter ${blocked ? "is-blocked" : ""}">
      <div>
        <strong>${escapeHtml(message)}</strong>
        <span>${escapeHtml(t("story.usage", { used, limit, plan: usage.planKey || "free" }))}</span>
      </div>
      <div class="usage-bar" aria-hidden="true"><span style="width:${percent}%"></span></div>
    </div>
  `;
}

function chapterMenuLabel(chapter) {
  const number = `${t("story.chapter")} ${chapter.chapter_number}`;
  const title = String(chapter.title || "").trim();
  return title && title.toLowerCase() !== number.toLowerCase() ? `${number} - ${title}` : number;
}

function renderChapterMenu(story, chapters, current) {
  const chapterItems = chapters.map((chapter) => `
    <button
      class="chapter-list-item ${chapter.id === current.id ? "is-active" : ""}"
      type="button"
      data-action="select-reader-chapter"
      data-chapter-id="${escapeHtml(chapter.id)}"
    >
      <span>${escapeHtml(chapterMenuLabel(chapter))}</span>
    </button>
  `).join("");

  return `
    <details class="chapter-menu">
      <summary aria-label="${escapeHtml(t("story.openChapterMenu"))}">
        <span class="hamburger" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
        <span class="sr-only">${escapeHtml(t("story.chapterMenu"))}</span>
      </summary>
      <div class="chapter-menu-panel">
        <a class="chapter-menu-action" href="#timeline">${escapeHtml(t("story.timeline"))}</a>
        <button class="chapter-menu-action is-danger" type="button" data-action="delete-story" data-story-id="${escapeHtml(story.id)}">${escapeHtml(t("story.delete"))}</button>
        <div class="chapter-list" aria-label="${escapeHtml(t("story.chooseChapter"))}">
          <span>${escapeHtml(t("story.chapters"))}</span>
          <div class="chapter-list-scroll">
            ${chapterItems}
          </div>
        </div>
      </div>
    </details>
  `;
}

export function renderStoryPlayerView(state) {
  const story = state.selectedStory;
  const chapters = state.chapters || [];
  const latest = chapters[chapters.length - 1];
  const selected = state.readerChapterId ? chapters.find((chapter) => chapter.id === state.readerChapterId) : null;
  const current = selected || latest;

  if (!story) {
    return `<section class="view-shell">${statusBlock(t("story.notFoundTitle"), t("story.notFoundBody"), `<a class="btn btn-primary" href="#dashboard">${escapeHtml(t("story.backLibrary"))}</a>`)}</section>`;
  }

  const highlightCurrentChapter = current?.id && state.highlightChapterId === current.id;
  const isLatestChapter = current?.id && latest?.id && current.id === latest.id;

  return `
    <section class="view-shell">
      <header class="view-header">
        <div class="story-heading-block">
          <span class="section-kicker">${escapeHtml(genreLabel(story.genre))} &middot; ${escapeHtml(storyLanguageLabel(story.language))} &middot; ${escapeHtml(audienceLabel(story.audience))}</span>
          <div class="story-title-row">
            <h1 class="view-title">${escapeHtml(story.title)}</h1>
            ${current ? renderChapterMenu(story, chapters, current) : ""}
          </div>
          <p>${escapeHtml(story.premise)}</p>
        </div>
      </header>
      ${current ? `
        <article class="panel chapter-reader" data-current-chapter>
          <h2 class="${highlightCurrentChapter ? "chapter-title-glow" : ""}">${escapeHtml(current.title)}</h2>
          ${renderTypewriterText(current.body)}
          ${isLatestChapter ? `<div class="stack">
            <h3>${escapeHtml(t("story.chooseNext"))}</h3>
            ${renderUsageMeter(state.usageStatus)}
            ${renderChoiceCards(current.choices || [], { disabled: state.usageStatus && !state.usageStatus.allowed })}
          </div>` : `
            <div class="chapter-archive-note">
              <div>
                <strong>${escapeHtml(t("story.archiveTitle"))}</strong>
                <span>${escapeHtml(t("story.archiveBody"))}</span>
              </div>
              <button class="btn btn-ghost" type="button" data-action="show-latest-chapter">${escapeHtml(t("story.latest"))}</button>
            </div>
          `}
        </article>
      ` : statusBlock(t("story.noChaptersTitle"), t("story.noChaptersBody"))}
    </section>
  `;
}
