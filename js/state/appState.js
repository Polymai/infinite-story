const initialState = {
  booting: true,
  loading: false,
  locale: "en",
  overlayMessage: "",
  route: { name: "home", params: {}, query: {} },
  session: null,
  user: null,
  profile: null,
  needsProfile: false,
  stories: [],
  selectedStory: null,
  chapters: [],
  readerChapterId: null,
  highlightChapterId: null,
  timeline: [],
  inventory: [],
  achievements: [],
  stats: null,
  usageStatus: null,
  plans: [],
  subscription: null,
  genres: [],
  error: "",
};

let state = { ...initialState };
const listeners = new Set();

export function getState() {
  return state;
}

export function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener(state));
}

export function updateState(updater) {
  setState(updater(state));
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetUserState() {
  setState({
    session: null,
    user: null,
    profile: null,
    needsProfile: false,
    stories: [],
    selectedStory: null,
    chapters: [],
    readerChapterId: null,
    highlightChapterId: null,
    timeline: [],
    inventory: [],
    achievements: [],
    stats: null,
    usageStatus: null,
    subscription: null,
    error: "",
  });
}
