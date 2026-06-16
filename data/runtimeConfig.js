(function () {
  const supabase = window.__POLYMAI_SUPABASE_CONFIG__ || {};
  const stripe = window.__POLYMAI_STRIPE_CONFIG__ || {};
  window.__DATA__ = Object.freeze({
    app: {
      id: "app695",
      name: "Infinite Story",
      schema: "app695_infinite_story",
      apiFunctionName: "app695-infinite-story-api",
      stripeWebhookFunctionName: "app695-infinite-story-stripe-webhook",
      storageBucket: "app695_infinite_story_artwork"
    },
    supabase,
    stripe,
    limits: {
      freeStories: 3,
      freeChaptersPerStory: 12
    }
  });
})();
