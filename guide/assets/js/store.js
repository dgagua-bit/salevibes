/** "My plan": selected routes and saved places, in localStorage; shareable via ?r=...&p=... */
const KEY = "gg:plan";
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { routes: [], places: [] }; } catch { return { routes: [], places: [] }; } };
const write = p => { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {} window.dispatchEvent(new CustomEvent("gg:plan", { detail: p })); };

export const plan = () => read();
export const hasRoute = id => read().routes.includes(id);
export const hasPlace = id => read().places.includes(id);
export function toggleRoute(id) { const p = read(); p.routes = p.routes.includes(id) ? p.routes.filter(x => x !== id) : [...p.routes, id]; write(p); return p.routes.includes(id); }
export function togglePlace(id) { const p = read(); p.places = p.places.includes(id) ? p.places.filter(x => x !== id) : [...p.places, id]; write(p); return p.places.includes(id); }
export function clear() { write({ routes: [], places: [] }); }
export const count = () => { const p = read(); return p.routes.length + p.places.length; };
/** Merge a shared plan from the URL (?r=a,b&p=c,d) into the local one. */
export function importFromUrl() {
  const q = new URLSearchParams(location.search);
  const r = (q.get("r") || "").split(",").filter(Boolean), pl = (q.get("p") || "").split(",").filter(Boolean);
  if (!r.length && !pl.length) return false;
  const p = read();
  p.routes = [...new Set([...p.routes, ...r])]; p.places = [...new Set([...p.places, ...pl])];
  write(p); return true;
}
export function shareUrl() {
  const p = read(), u = new URL("plan.html", location.href);
  if (p.routes.length) u.searchParams.set("r", p.routes.join(","));
  if (p.places.length) u.searchParams.set("p", p.places.join(","));
  return u.toString();
}
