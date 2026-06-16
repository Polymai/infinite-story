import { getState, resetUserState, setState, subscribe } from "./state/appState.js";
import { navigate, parseRoute, isProtectedRoute, startRouter } from "./core/router.js";
import { showToast } from "./core/toast.js";
import { withTimeout } from "./core/requestTimeout.js";
import { initLocale, nextLocale, setLocale, t } from "./core/i18n.js";
import { getSession, onAuthChange, signIn, signOut, signUp } from "./services/authService.js";
import { completeProfile } from "./services/profileService.js";
import { createStory, deleteStory, loadStories, loadStoryBundle } from "./services/storyService.js";
import { continueStory, getUsageStatus } from "./services/storyEngineService.js";
import { loadAchievements, loadInventory, loadStats } from "./services/playerDataService.js";
import { loadBilling, openBillingPortal, startCheckout } from "./services/billingService.js";
import { saveSettings } from "./services/settingsService.js";
import { renderAppShell, renderPublicShell } from "./ui/shell.js";
import { renderLandingView } from "./ui/landingView.js";
import { renderAuthView } from "./ui/authView.js";
import { renderDashboardView } from "./ui/dashboardView.js";
import { renderCreateStoryView } from "./ui/createStoryView.js";
import { renderStoryPlayerView } from "./ui/storyPlayerView.js";
import { renderTimelineView } from "./ui/timelineView.js";
import { renderInventoryView } from "./ui/inventoryView.js";
import { renderAchievementsView } from "./ui/achievementsView.js";
import { renderStatsView } from "./ui/statsView.js";
import { renderSubscriptionView } from "./ui/subscriptionView.js";
import { renderSettingsView } from "./ui/settingsView.js";
import { statusBlock, errorBlock } from "./ui/components/emptyStates.js";
import { loadProfile } from "./services/profileService.js";

const app = document.getElementById("app");
const logoMarkUrl = new URL("../assets/logo-mark.png", import.meta.url).href;

function updateScrollChrome() {
  document.documentElement.classList.toggle("is-scrolled", window.scrollY > 28);
}

function scrollToCurrentChapter() {
  window.requestAnimationFrame(() => {
    const chapter = document.querySelector("[data-current-chapter]");
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (chapter) {
      chapter.scrollIntoView({ behavior, block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
    updateScrollChrome();
  });
}

window.addEventListener("scroll", updateScrollChrome, { passive: true });
updateScrollChrome();

async function loadGenres() {
  const response = await fetch(new URL("../data/genres.json", import.meta.url));
  if (!response.ok) throw new Error("Could not load genres.");
  return await response.json();
}

function collectForm(form) {
  return Object.fromEntries(new FormData(form).entries());
}

async function refreshUser(session) {
  if (!session?.user) {
    resetUserState();
    return;
  }

  const profile = await loadProfile(session.user.id);
  setState({
    session,
    user: session.user,
    profile,
    needsProfile: !profile,
  });
}

async function loadDashboardData() {
  const [stories, inventory, billing] = await Promise.all([
    loadStories(),
    loadInventory(),
    loadBilling(),
  ]);
  const achievements = await loadAchievements();
  const stats = await loadStats();
  setState({
    stories,
    stats,
    inventory,
    achievements,
    plans: billing.plans,
    subscription: billing.subscription,
  });
}

async function syncRouteData(route) {
  const state = getState();
  if (isProtectedRoute(route.name) && !state.user) {
    navigate("auth");
    return;
  }
  if (state.user && !state.profile && route.name !== "auth") {
    navigate("auth");
    return;
  }

  try {
    setState({ loading: true, error: "" });
    if (["dashboard", "inventory", "achievements", "stats", "billing"].includes(route.name)) {
      await withTimeout(loadDashboardData(), t("status.loading"));
    }
    if (route.name === "story" && route.params.storyId) {
      const [bundle, usageStatus] = await Promise.all([
        withTimeout(loadStoryBundle(route.params.storyId), t("status.loading")),
        getUsageStatus().catch(() => null),
      ]);
      setState({
        selectedStory: bundle.story,
        chapters: bundle.chapters,
        readerChapterId: null,
        timeline: bundle.timeline,
        usageStatus,
      });
    }
    if (route.name === "timeline" && !getState().selectedStory && getState().stories[0]) {
      const bundle = await loadStoryBundle(getState().stories[0].id);
      setState({ selectedStory: bundle.story, chapters: bundle.chapters, timeline: bundle.timeline });
    }
  } catch (error) {
    setState({ error: error.message || "Data failed to load." });
  } finally {
    setState({ loading: false });
  }
}

function protectedContent(state) {
  if (state.error) {
    return `<section class="view-shell">${errorBlock(state.error)}</section>`;
  }
  if (state.loading && !["create", "settings"].includes(state.route.name)) {
    return `<section class="view-shell">${statusBlock(t("status.loading"), t("status.loadingBody"))}</section>`;
  }

  if (state.route.name === "create") return renderCreateStoryView(state);
  if (state.route.name === "story") return renderStoryPlayerView(state);
  if (state.route.name === "timeline") return renderTimelineView(state);
  if (state.route.name === "inventory") return renderInventoryView(state);
  if (state.route.name === "achievements") return renderAchievementsView(state);
  if (state.route.name === "stats") return renderStatsView(state);
  if (state.route.name === "billing") return renderSubscriptionView(state);
  if (state.route.name === "settings") return renderSettingsView(state);
  return renderDashboardView(state);
}

function render(state) {
  if (state.booting) {
    app.innerHTML = `
      <div class="boot-screen" role="status" aria-busy="true">
        <img class="boot-logo" src="${logoMarkUrl}" alt="" aria-hidden="true">
        <span>${t("boot.opening")}</span>
      </div>
    `;
    return;
  }

  if (state.route.name === "home") {
    app.innerHTML = renderPublicShell(renderLandingView());
    return;
  }

  if (state.route.name === "auth" || state.needsProfile) {
    app.innerHTML = renderPublicShell(renderAuthView(state), "auth");
    return;
  }

  app.innerHTML = renderAppShell(state, protectedContent(state));
}

async function handleAuthSubmit(form) {
  const data = collectForm(form);
  const mode = form.dataset.mode;
  setState({ overlayMessage: mode === "signup" ? t("overlay.creatingAccount") : t("overlay.signingIn") });
  try {
    const session = mode === "signup"
      ? await signUp(data.email, data.password, data.displayName)
      : await signIn(data.email, data.password);
    if (session) await refreshUser(session);
    showToast(mode === "signup" ? t("toast.accountCreated") : t("toast.signedIn"));
    if (getState().profile) navigate("dashboard");
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setState({ overlayMessage: "" });
  }
}

async function handleCompleteProfile(form) {
  const state = getState();
  const data = collectForm(form);
  setState({ overlayMessage: t("overlay.creatingProfile") });
  try {
    const profile = await completeProfile(state.user, data);
    setState({ profile, needsProfile: false });
    showToast(t("toast.profileCreated"));
    navigate("dashboard");
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setState({ overlayMessage: "" });
  }
}

async function handleCreateStory(form) {
  const data = collectForm(form);
  setState({ overlayMessage: t("overlay.creatingChapter") });
  try {
    const storyId = await createStory(data);
    showToast(t("toast.storyCreated"));
    await loadDashboardData();
    navigate("story", { storyId });
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    setState({ overlayMessage: "" });
  }
}

async function handleSettings(form) {
  const state = getState();
  const data = collectForm(form);
  data.reducedMotion = form.elements.reducedMotion.checked;
  try {
    const profile = await saveSettings(state.user.id, data);
    setState({ profile });
    showToast(t("toast.settingsSaved"));
  } catch (error) {
    showToast(error.message, "error");
  }
}

document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  const name = form.dataset.form;
  if (!name) return;
  event.preventDefault();
  if (name === "auth") await handleAuthSubmit(form);
  if (name === "complete-profile") await handleCompleteProfile(form);
  if (name === "create-story") await handleCreateStory(form);
  if (name === "settings") await handleSettings(form);
});

document.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action], [data-choice-index]");
  if (!target) return;

  const state = getState();
  if (target.dataset.action === "sign-out") {
    await signOut();
    resetUserState();
    navigate("home");
    return;
  }

  if (target.dataset.action === "toggle-locale") {
    setState({ locale: setLocale(nextLocale()) });
    return;
  }

  if (target.dataset.action === "delete-story") {
    setState({ overlayMessage: t("overlay.deletingStory") });
    try {
      await deleteStory(target.dataset.storyId);
      showToast(t("toast.storyDeleted"));
      await loadDashboardData();
      navigate("dashboard");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setState({ overlayMessage: "" });
    }
    return;
  }

  if (target.dataset.action === "show-latest-chapter") {
    const latest = state.chapters[state.chapters.length - 1];
    setState({ readerChapterId: latest?.id || null, highlightChapterId: null });
    scrollToCurrentChapter();
    return;
  }

  if (target.dataset.action === "select-reader-chapter") {
    setState({ readerChapterId: target.dataset.chapterId || null, highlightChapterId: null });
    scrollToCurrentChapter();
    return;
  }

  if (target.hasAttribute("data-choice-index")) {
    const current = state.chapters[state.chapters.length - 1];
    const choice = current?.choices?.[Number(target.dataset.choiceIndex)];
    if (!state.selectedStory || !choice) return;
    if (state.usageStatus && !state.usageStatus.allowed) {
      const seconds = Number(state.usageStatus.cooldownRemainingSeconds || 0);
      const message = state.usageStatus.reason === "daily_limit"
        ? t("toast.dailyLimit")
        : t("toast.nextChapterMinutes", { minutes: Math.ceil(seconds / 60) });
      showToast(message, "error");
      return;
    }
    setState({ overlayMessage: t("overlay.writingChapter") });
    try {
      const result = await continueStory(state.selectedStory.id, `${choice.label}: ${choice.text}`, current.id);
      const bundle = await loadStoryBundle(state.selectedStory.id);
      const inventory = await loadInventory();
      const stats = await loadStats();
      const newChapter = bundle.chapters[bundle.chapters.length - 1] || null;
      setState({
        selectedStory: bundle.story,
        chapters: bundle.chapters,
        readerChapterId: null,
        highlightChapterId: newChapter?.id || null,
        timeline: bundle.timeline,
        inventory,
        stats,
        usageStatus: result.usage || await getUsageStatus().catch(() => null),
      });
      scrollToCurrentChapter();
      if (newChapter?.id) {
        window.setTimeout(() => {
          if (getState().highlightChapterId === newChapter.id) {
            setState({ highlightChapterId: null });
          }
        }, 2400);
      }
      showToast(t("toast.newChapter"));
    } catch (error) {
      if (error.usage) setState({ usageStatus: error.usage });
      showToast(error.message, "error");
    } finally {
      setState({ overlayMessage: "" });
    }
    return;
  }

  if (target.dataset.action === "checkout") {
    setState({ overlayMessage: t("overlay.checkout") });
    try {
      await startCheckout(target.dataset.planKey);
    } catch (error) {
      showToast(error.message, "error");
      setState({ overlayMessage: "" });
    }
    return;
  }

  if (target.dataset.action === "billing-portal") {
    setState({ overlayMessage: t("overlay.billingPortal") });
    try {
      await openBillingPortal();
    } catch (error) {
      showToast(error.message, "error");
      setState({ overlayMessage: "" });
    }
  }
});

subscribe(render);

async function boot() {
  try {
    const locale = initLocale();
    const [genres, session] = await Promise.all([loadGenres(), getSession()]);
    setState({ genres, route: parseRoute(), locale });
    if (session) {
      await refreshUser(session);
    }
    onAuthChange(async (nextSession) => {
      await refreshUser(nextSession);
      if (!nextSession) navigate("home");
    });
  } catch (error) {
    setState({ error: error.message || "Boot failed." });
  } finally {
    setState({ booting: false });
  }

  startRouter((route) => {
    setState({ route });
    syncRouteData(route);
  });
}

boot();
