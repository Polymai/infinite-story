const publicRoutes = new Set(["home", "auth"]);
const routeNames = new Set(["home", "auth", "dashboard", "create", "story", "timeline", "inventory", "achievements", "stats", "billing", "settings"]);

export function parseRoute(hash = window.location.hash) {
  const raw = hash.replace(/^#\/?/, "") || "home";
  const [pathPart, queryPart] = raw.split("?");
  const segments = pathPart.split("/").filter(Boolean);
  const name = routeNames.has(segments[0]) ? segments[0] : "home";
  const params = {};
  if (name === "story" && segments[1]) params.storyId = segments[1];
  const query = Object.fromEntries(new URLSearchParams(queryPart || ""));
  return { name, params, query };
}

export function isProtectedRoute(routeName) {
  return !publicRoutes.has(routeName);
}

export function navigate(routeName, params = {}, query = {}) {
  const safeName = routeNames.has(routeName) ? routeName : "home";
  const parts = [safeName];
  if (safeName === "story" && params.storyId) parts.push(params.storyId);
  const search = new URLSearchParams(query).toString();
  window.location.hash = `${parts.join("/")}${search ? `?${search}` : ""}`;
}

export function startRouter(onChange) {
  const emit = () => onChange(parseRoute());
  window.addEventListener("hashchange", emit);
  emit();
}
