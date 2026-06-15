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
        <div class="hero-stats" aria-label="Product highlights">
          <div class="metric"><strong>AI</strong><span>continuations</span></div>
          <div class="metric"><strong>3</strong><span>branch choices</span></div>
          <div class="metric"><strong>RLS</strong><span>private worlds</span></div>
        </div>
      </section>
      <span aria-hidden="true"></span>
    </main>
  `;
}
