import { escapeHtml } from "./components/emptyStates.js";

export function renderAuthView(state) {
  const signup = state.route.query.mode === "signup";
  const needsProfile = state.needsProfile && state.user;
  if (needsProfile) {
    return `
      <main class="auth-card panel">
        <span class="section-kicker">Complete setup</span>
        <h1>Prepare your library</h1>
        <p class="muted">Your Supabase account is signed in. Create an Infinite Story profile to keep this app's data separate from other apps on the same provider.</p>
        <form class="form-grid" data-form="complete-profile">
          <div class="field"><label for="displayName">Display name</label><input id="displayName" name="displayName" required value="${escapeHtml(state.user.email?.split("@")[0] || "Storyteller")}"></div>
          <div class="field"><label for="favoriteGenre">Favorite genre</label><select id="favoriteGenre" name="favoriteGenre">${genreOptions(state.genres)}</select></div>
          <button class="btn btn-primary" type="submit">Create profile</button>
        </form>
      </main>
    `;
  }

  return `
    <main class="auth-card panel">
      <span class="section-kicker">${signup ? "New library" : "Welcome back"}</span>
      <h1>${signup ? "Create your account" : "Sign in"}</h1>
      <form class="form-grid" data-form="auth" data-mode="${signup ? "signup" : "signin"}">
        ${signup ? '<div class="field"><label for="displayName">Display name</label><input id="displayName" name="displayName" autocomplete="name" required></div>' : ""}
        <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="${signup ? "new-password" : "current-password"}" minlength="6" required></div>
        <button class="btn btn-primary" type="submit">${signup ? "Create account" : "Sign in"}</button>
      </form>
      <p class="trust-note">Sign-in is handled securely by Supabase. If you have used another service from the same provider, the same account may work here.</p>
      <p class="muted">${signup ? 'Already have an account? <a href="#auth">Sign in</a>.' : 'New to Infinite Story? <a href="#auth?mode=signup">Create an account</a>.'}</p>
    </main>
  `;
}

function genreOptions(genres = []) {
  return genres.map((genre) => `<option value="${escapeHtml(genre.key)}">${escapeHtml(genre.label)}</option>`).join("");
}
