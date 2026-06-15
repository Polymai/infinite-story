import { supabase } from "./supabaseClient.js";
import { removeLocal, writeLocal } from "../core/storageKeys.js";

function authRedirectTo() {
  const configured = window.__POLYMAI_SUPABASE_CONFIG__?.siteUrl;
  if (configured) return configured;
  return `${window.location.origin}${window.location.pathname}`;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signUp(email, password, displayName) {
  writeLocal("pending-signup", { displayName, createdAt: Date.now() });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: authRedirectTo(),
      data: { display_name: displayName },
    },
  });
  if (error) {
    removeLocal("pending-signup");
    if (/already|registered|exists/i.test(error.message)) {
      throw new Error("This email may already work for sign-in. Sign in instead, or reset your password.");
    }
    throw error;
  }
  return data.session;
}

export async function signOut() {
  removeLocal("pending-signup");
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
