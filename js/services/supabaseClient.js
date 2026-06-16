import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";

export const runtime = window.__DATA__;
export const config = window.__POLYMAI_SUPABASE_CONFIG__;
export const APP_SCHEMA = runtime?.app?.schema || "app695_infinite_story";
export const API_FUNCTION = runtime?.app?.apiFunctionName || "app695-infinite-story-api";

if (!config?.url || !config?.anonKey) {
  throw new Error("Polymai Supabase runtime config is missing.");
}

export const supabase = createClient(config.url, config.anonKey, {
  db: { schema: APP_SCHEMA },
  auth: {
    storageKey: config.authStorageKey,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const appDb = supabase.schema(APP_SCHEMA);

export async function appAction(action, payload = {}, options = {}) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  const timeoutMs = Number(options.timeoutMs || 0);
  const controller = timeoutMs > 0 ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;

  try {
    const response = await fetch(`${config.functionsBaseUrl}/${API_FUNCTION}`, {
      method: "POST",
      signal: controller?.signal,
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ action, ...payload }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(body?.error?.message || `Function returned HTTP ${response.status}.`);
      error.status = response.status;
      error.body = body;
      error.usage = body?.usage || null;
      throw error;
    }
    return body;
  } catch (error) {
    if (error?.name === "AbortError") {
      const timeoutError = new Error(`${action} timed out after ${Math.round(timeoutMs / 1000)} seconds.`);
      timeoutError.code = "timeout";
      throw timeoutError;
    }
    throw error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
