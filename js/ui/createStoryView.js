import { escapeHtml } from "./components/emptyStates.js";

export function renderCreateStoryView(state) {
  return `
    <section class="view-shell">
      <header class="view-header">
        <div>
          <span class="section-kicker">Create</span>
          <h1 class="view-title">Open a new world</h1>
          <p>Set a premise and the first chapter will be created immediately. Future chapters continue through the AI Edge Function.</p>
        </div>
      </header>
      <form class="panel form-grid" data-form="create-story">
        <div class="field">
          <label for="title">Story title</label>
          <input id="title" name="title" required maxlength="120" placeholder="The Archive Beneath the Sea">
        </div>
        <div class="grid-2">
          <div class="field">
            <label for="genre">Genre</label>
            <select id="genre" name="genre">${state.genres.map((genre) => `<option value="${escapeHtml(genre.key)}">${escapeHtml(genre.label)}</option>`).join("")}</select>
          </div>
          <div class="field">
            <label for="language">Story language</label>
            <select id="language" name="language">
              <option value="en">English</option>
              <option value="sv" selected>Svenska</option>
              <option value="es">Espanol</option>
              <option value="fr">Francais</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label for="tone">Tone</label>
          <select id="tone" name="tone">
            <option value="cinematic">Cinematic</option>
            <option value="quiet">Quiet</option>
            <option value="tense">Tense</option>
            <option value="playful">Playful</option>
          </select>
        </div>
        <div class="field">
          <label for="premise">Premise</label>
          <textarea id="premise" name="premise" required maxlength="1200" placeholder="A cartographer finds a coastline that moves whenever someone tells a lie."></textarea>
        </div>
        <button class="btn btn-primary" type="submit">Create opening chapter</button>
      </form>
    </section>
  `;
}
