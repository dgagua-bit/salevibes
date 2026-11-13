/**
 * Loaded on every page: header link to the cabinet, and "save" buttons that
 * write to the account when the visitor is signed in. The Supabase client is
 * imported only when a session exists or the visitor saves something.
 */
const SESSION_KEY = "sv-auth";
const signedIn = () => { try { return !!localStorage.getItem(SESSION_KEY); } catch { return false; } };

function addHeaderLink() {
  const host = document.querySelector(".header-actions") || document.querySelector(".header-tools");
  if (!host || host.querySelector(".acct-link")) return;
  const a = document.createElement("a");
  a.className = "acct-link";
  a.href = "account.html";
  a.textContent = signedIn() ? "◉ კაბინეტი" : "შესვლა";
  a.setAttribute("aria-label", signedIn() ? "ჩემი კაბინეტი" : "შესვლა ან რეგისტრაცია");
  host.insertBefore(a, host.firstChild);
  const st = document.createElement("style");
  st.textContent = `.acct-link{white-space:nowrap;text-decoration:none;padding:8px 12px;border-radius:99px;font-size:15px;color:inherit;transition:background .2s}.acct-link:hover{background:rgba(127,127,127,.18)}@media(max-width:600px){.acct-link{font-size:13px;padding:6px 8px}}`;
  document.head.appendChild(st);
}

async function withAuth(fn) {
  if (!signedIn()) { location.href = "account.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search); return; }
  const auth = await import("./auth.js");
  if (!(await auth.currentUser())) { location.href = "account.html"; return; }
  return fn(auth);
}

document.addEventListener("click", e => {
  const b = e.target.closest("[data-save-compare]");
  if (!b) return;
  e.preventDefault();
  withAuth(async auth => {
    b.disabled = true;
    try {
      await auth.saveItem({
        kind: "compare", ref: b.dataset.saveCompare, item_key: "compare:" + b.dataset.saveCompare,
        title: b.dataset.title || null, url: b.dataset.url || null, currency: b.dataset.currency || null,
        price_at_save: Number(b.dataset.price) || null, last_price: Number(b.dataset.price) || null, track_status: "tracking"
      });
      b.textContent = "♥ შენახულია კაბინეტში";
    } catch { b.textContent = "შენახვა ვერ მოხერხდა"; b.disabled = false; }
  });
});

// ♡ on catalogue cards (ui.js dispatches sv:heart): mirror into the account when signed in
window.addEventListener("sv:heart", ev => {
  if (!signedIn()) return;
  const { type, id, on, snap } = ev.detail || {};
  import("./auth.js").then(async auth => {
    if (!(await auth.currentUser())) return;
    const key = `${type}:${id}`;
    if (on) await auth.saveItem({ kind: type === "offer" ? "offer" : "deal", ref: String(id), item_key: key, title: snap?.title || null, price_at_save: snap?.priceAtSave ?? null, currency: snap?.currency || null, track_status: "tracking" });
    else { const rows = await auth.listSaved(); const r = rows.find(x => x.item_key === key); if (r) await auth.removeItem(r.id); }
  }).catch(() => { /* offline: stays in this browser's list */ });
});

addHeaderLink();
