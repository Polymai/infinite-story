const prefix = window.__POLYMAI_SUPABASE_CONFIG__?.appStoragePrefix || "polymai:app695:";

export function storageKey(name) {
  return `${prefix}${name}`;
}

export function readLocal(name, fallback = null) {
  try {
    const value = localStorage.getItem(storageKey(name));
    return value ? JSON.parse(value) : fallback;
  } catch (_error) {
    return fallback;
  }
}

export function writeLocal(name, value) {
  localStorage.setItem(storageKey(name), JSON.stringify(value));
}

export function removeLocal(name) {
  localStorage.removeItem(storageKey(name));
}
