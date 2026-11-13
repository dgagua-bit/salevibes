/**
 * Accounts: Supabase Auth (e-mail + password) and the user's own data
 * (profile, interests, saved items). Row Level Security limits every query
 * to the signed-in user's rows. Loaded only on pages that need it.
 */
import { createClient } from "../vendor/supabase-js-2.45.4.js"; // vendored ESM build of @supabase/supabase-js 2.45.4 (MIT)
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

const STORAGE_KEY = "sv-auth";
export const supa = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: STORAGE_KEY }
});

/** Cheap check usable before this module loads: is there a stored session? */
export const hasSessionHint = () => { try { return !!localStorage.getItem(STORAGE_KEY); } catch { return false; } };
export const accountUrl = () => new URL("account.html", location.href).toString();

export async function currentUser() { const { data } = await supa.auth.getSession(); return data.session?.user || null; }

const msg = e => {
  const m = String(e?.message || e || "");
  if (/Invalid login credentials/i.test(m)) return "ელფოსტა ან პაროლი არასწორია.";
  if (/Email not confirmed/i.test(m)) return "ჯერ დაადასტურე ელფოსტა — ბმული წერილში გამოგიგზავნეთ.";
  if (/already registered|already been registered/i.test(m)) return "ეს ელფოსტა უკვე დარეგისტრირებულია. სცადე შესვლა.";
  if (/Password should be at least/i.test(m)) return "პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო.";
  if (/rate limit|too many/i.test(m)) return "ძალიან ბევრი მცდელობა. სცადე რამდენიმე წუთში.";
  return "მოქმედება ვერ შესრულდა. სცადე ხელახლა.";
};
const run = async p => { const { data, error } = await p; if (error) throw new Error(msg(error)); return data; };

export const signUp = (email, password) => run(supa.auth.signUp({ email, password, options: { emailRedirectTo: accountUrl() } }));
export const signIn = (email, password) => run(supa.auth.signInWithPassword({ email, password }));
export const signOut = () => supa.auth.signOut();
export const resetPassword = email => run(supa.auth.resetPasswordForEmail(email, { redirectTo: accountUrl() }));
export const updatePassword = password => run(supa.auth.updateUser({ password }));

/* ---------- profile ---------- */
export const getProfile = async () => (await run(supa.from("profiles").select("display_name,email_alerts").maybeSingle())) || { email_alerts: true };
export const updateProfile = async patch => { const u = await currentUser(); return run(supa.from("profiles").update(patch).eq("id", u.id)); };

/* ---------- interests ---------- */
export const getInterests = () => run(supa.from("user_interests").select("kind,value"));
export async function setInterest(kind, value, on) {
  const u = await currentUser();
  if (on) return run(supa.from("user_interests").upsert({ user_id: u.id, kind, value }, { onConflict: "user_id,kind,value" }));
  return run(supa.from("user_interests").delete().eq("kind", kind).eq("value", value));
}

/* ---------- saved items ---------- */
export const listSaved = () => run(supa.from("saved_items").select("*").order("created_at", { ascending: false }));
export async function saveItem(row) {
  const u = await currentUser();
  return run(supa.from("saved_items").upsert({ ...row, user_id: u.id }, { onConflict: "user_id,kind,item_key" }).select().single());
}
export const removeItem = id => run(supa.from("saved_items").delete().eq("id", id));
export const setTarget = (id, target) => run(supa.from("saved_items").update({ target_price: target > 0 ? target : null, alerted_at: null }).eq("id", id));
export const linkHistory = id => run(supa.from("link_prices").select("price,currency,observed_at").eq("saved_item_id", id).order("observed_at"));

async function callCabinet(body) {
  const { data, error } = await supa.functions.invoke("cabinet", { body });
  if (error) throw new Error("სერვერმა ვერ უპასუხა. სცადე მოგვიანებით.");
  return data;
}
export const trackLink = id => callCabinet({ action: "track", id });
export const deleteAccount = async () => { await callCabinet({ action: "delete_account" }); await supa.auth.signOut(); };

/** Normalise a product link so the same page isn't saved twice. */
export function normalizeLink(raw) {
  const u = new URL(String(raw).trim());
  if (!/^https?:$/.test(u.protocol)) throw new Error("ბმული უნდა იწყებოდეს https://-ით.");
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid", "mc_cid", "mc_eid"].forEach(p => u.searchParams.delete(p));
  u.hash = "";
  return u.toString();
}

/** Push this browser's ♡ items into the account (runs after sign-in). */
export async function syncLocalWishlist(local) {
  const rows = Object.values(local.items || {}).map(it => ({
    kind: it.type === "offer" ? "offer" : "deal", ref: String(it.id), item_key: `${it.type}:${it.id}`,
    title: it.title || null, price_at_save: it.priceAtSave ?? null, currency: it.currency || null,
    target_price: it.targetPrice || null, track_status: "tracking"
  }));
  if (!rows.length) return 0;
  const u = await currentUser();
  await run(supa.from("saved_items").upsert(rows.map(r => ({ ...r, user_id: u.id })), { onConflict: "user_id,kind,item_key", ignoreDuplicates: true }));
  return rows.length;
}
