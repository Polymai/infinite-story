import { runtime, supabase } from "./supabaseClient.js";

export async function uploadArtwork(userId, file) {
  if (!file) return null;
  const safeName = file.name.replace(/[^a-z0-9.-]/gi, "-").toLowerCase();
  const path = `${userId}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from(runtime.app.storageBucket).upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

export async function signedArtworkUrl(path) {
  if (!path) return "";
  const { data, error } = await supabase.storage.from(runtime.app.storageBucket).createSignedUrl(path, 600);
  if (error) throw error;
  return data.signedUrl;
}
