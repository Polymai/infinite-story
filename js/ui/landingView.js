export function renderLandingView() {
  return `
    <main class="hero">
      <section class="hero-copy">
        <span class="section-kicker">Interactive fiction that remembers</span>
        <h1 class="display-title">Infinite Story</h1>
        <p>Create living stories that branch, remember your choices, reward discoveries, and keep a clean timeline as your world expands.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#auth?mode=signup">Begin writing</a>
          <a class="btn btn-ghost" href="#auth">Sign in</a>
        </div>
        <div class="hero-examples" aria-label="Example story prompts">
          <article class="prompt-card">
            <span>Artifact twist</span>
            <strong>Swapping blades inside a book</strong>
            <p>A dueling manual where every page turn trades the hero's weapon with an enemy's.</p>
          </article>
          <article class="prompt-card">
            <span>Living clue</span>
            <strong>A map that edits itself</strong>
            <p>Each choice redraws a safe road and erases one person from the legend.</p>
          </article>
          <article class="prompt-card">
            <span>Memory item</span>
            <strong>A ring that remembers lies</strong>
            <p>The story tracks every promise and makes the next chapter answer for it.</p>
          </article>
        </div>
      </section>
      <span aria-hidden="true"></span>
    </main>
  `;
}
