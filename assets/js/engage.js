/**
 * Visitor feedback ("როგორ მოგწონთ?") + privacy-friendly page-view counter.
 * Stores rows in Supabase (anon may INSERT only; nobody can read them from the site).
 * No cookies, no IP or personal data: a random per-browser id, the page path,
 * the referring site's host and a device class.
 */
const URL_ = "https://fyfanpmszhopxjaerubd.supabase.co/rest/v1/";
const KEY = "sb_publishable_cRKWVslW5OztfzeT-iH_Lg_DVWeK5au";
const device = () => (innerWidth < 700 ? "mobile" : innerWidth < 1100 ? "tablet" : "desktop");
const post = (table, row) => fetch(URL_ + table, { method: "POST", keepalive: true, headers: { apikey: KEY, "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(row) });
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* blocked */ } }
};
const path = (location.pathname.replace(/^.*\//, "/") || "/") + (location.search.length < 80 ? location.search : "");

/* ---- page view (once per page per tab session) ---- */
(function track() {
  if (navigator.doNotTrack === "1" || /localhost|127\.0\.0\.1/.test(location.hostname)) return;
  let vid = store.get("sv-vid");
  if (!vid) { vid = Math.random().toString(36).slice(2, 12) + Date.now().toString(36); store.set("sv-vid", vid); }
  const seenKey = "sv-pv:" + path;
  try { if (sessionStorage.getItem(seenKey)) return; sessionStorage.setItem(seenKey, "1"); } catch { /* ignore */ }
  let ref = "";
  try { const r = new URL(document.referrer); if (r.hostname !== location.hostname) ref = r.hostname; } catch { /* none */ }
  post("page_views", { path: path.slice(0, 200), referrer: ref.slice(0, 200) || null, device: device(), visitor: vid.slice(0, 40) }).catch(() => {});
})();

/* ---- feedback widget ---- */
const css = `
.svfb-btn{position:fixed;right:18px;bottom:18px;z-index:60;background:#181614;color:#f3eee5;border:1px solid #f3eee533;padding:12px 18px;font:500 13px 'Noto Sans Georgian',Arial,sans-serif;letter-spacing:.5px;cursor:pointer;box-shadow:0 6px 24px #0003;transition:background .2s,transform .2s}
.svfb-btn:hover{background:#9f2529}.svfb-btn:focus-visible{outline:2px solid #c77465;outline-offset:3px}
.svfb{position:fixed;right:18px;bottom:72px;z-index:61;width:min(340px,calc(100vw - 36px));background:#f0ede7;color:#181614;border:1px solid #181614;padding:22px 22px 18px;font:14px/1.6 'Noto Sans Georgian',Arial,sans-serif;box-shadow:0 18px 50px #0004}
.svfb h3{font:400 20px 'Noto Serif Georgian',Georgia,serif;margin:0 0 4px}.svfb p{margin:0 0 12px;font-size:12.5px;color:#6f665d}
.svfb-x{position:absolute;right:10px;top:8px;background:none;border:0;font-size:22px;cursor:pointer;color:#181614;width:36px;height:36px}
.svfb-stars{display:flex;gap:4px;margin:6px 0 12px}.svfb-stars button{background:none;border:0;font-size:30px;line-height:1;cursor:pointer;color:#cfc6b8;padding:2px;transition:transform .15s}
.svfb .svfb-stars button:hover,.svfb .svfb-stars button.on{color:#9f2529}.svfb-stars button:hover{transform:scale(1.12)}
.svfb textarea{width:100%;min-height:84px;border:1px solid #bcb4a7;background:#fff;padding:10px;font:inherit;font-size:13.5px;resize:vertical;box-sizing:border-box}
.svfb-send{margin-top:10px;width:100%;background:#181614;color:#fff;border:0;padding:12px;font:inherit;font-size:13px;letter-spacing:1px;cursor:pointer}.svfb-send:hover{background:#9f2529}.svfb-send[disabled]{opacity:.5;cursor:not-allowed}
.svfb-st{display:block;min-height:18px;margin-top:8px;font-size:12.5px}.svfb-st.ok{color:#3f6b4a}.svfb-st.err{color:#9f2529}
@media(max-width:600px){.svfb-btn{right:12px;bottom:12px;padding:10px 14px;font-size:12px}.svfb{right:12px;bottom:60px}}
@media(prefers-reduced-motion:reduce){.svfb-btn,.svfb-stars button{transition:none}}`;
const style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

const btn = document.createElement("button");
btn.type = "button"; btn.className = "svfb-btn"; btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "svfb");
btn.textContent = "★ როგორ მოგწონთ?";
const box = document.createElement("div");
box.className = "svfb"; box.id = "svfb"; box.hidden = true; box.setAttribute("role", "dialog"); box.setAttribute("aria-labelledby", "svfb-h");
box.innerHTML = `<button type="button" class="svfb-x" aria-label="დახურვა">×</button>
<h3 id="svfb-h">როგორ მოგწონთ Sale Vibes?</h3><p>საიტი სატესტო რეჟიმშია — თქვენი აზრი დაგვეხმარება.</p>
<div class="svfb-stars" role="radiogroup" aria-label="შეფასება 1-დან 5-მდე">${[1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="false" data-v="${n}" aria-label="${n} ვარსკვლავი">★</button>`).join("")}</div>
<label for="svfb-c" style="font-size:12.5px;color:#6f665d">რა მოგეწონათ ან რა გავაუმჯობესოთ? (არასავალდებულო)</label>
<textarea id="svfb-c" maxlength="1000" placeholder="თქვენი კომენტარი…"></textarea>
<button type="button" class="svfb-send">გაგზავნა</button>
<small class="svfb-st" role="status" aria-live="polite">პირად მონაცემებს არ ვაგროვებთ.</small>`;
document.body.append(btn, box);

let rating = 0;
const stars = [...box.querySelectorAll(".svfb-stars button")];
const paint = v => stars.forEach(s => { const on = Number(s.dataset.v) <= v; s.classList.toggle("on", on); s.setAttribute("aria-checked", String(Number(s.dataset.v) === v)); });
const open = o => { box.hidden = !o; btn.setAttribute("aria-expanded", String(o)); if (o) (stars[rating ? rating - 1 : 0]).focus(); };
btn.addEventListener("click", () => open(box.hidden));
box.querySelector(".svfb-x").addEventListener("click", () => { open(false); btn.focus(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !box.hidden) { open(false); btn.focus(); } });
stars.forEach(s => {
  s.addEventListener("click", () => { rating = Number(s.dataset.v); paint(rating); });
  s.addEventListener("mouseenter", () => paint(Number(s.dataset.v)));
  s.addEventListener("keydown", e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); rating = Math.min(5, Math.max(1, (rating || 0) + (e.key === "ArrowRight" ? 1 : -1))); paint(rating); stars[rating - 1].focus(); } });
});
box.querySelector(".svfb-stars").addEventListener("mouseleave", () => paint(rating));
if (store.get("sv-fb-sent")) btn.textContent = "★ კიდევ გვითხარით";

box.querySelector(".svfb-send").addEventListener("click", async e => {
  const st = box.querySelector(".svfb-st"), send = e.currentTarget;
  st.className = "svfb-st";
  if (!rating) { st.textContent = "აირჩიეთ შეფასება (1–5 ვარსკვლავი)."; st.classList.add("err"); return; }
  send.disabled = true; st.textContent = "იგზავნება…";
  try {
    const comment = box.querySelector("#svfb-c").value.trim().slice(0, 1000) || null;
    const r = await post("feedback", { rating, comment, page: path.slice(0, 200), device: device() });
    if (!r.ok) throw new Error(String(r.status));
    st.textContent = "მადლობა! თქვენი აზრი მივიღეთ ✓"; st.classList.add("ok");
    store.set("sv-fb-sent", "1"); btn.textContent = "★ კიდევ გვითხარით";
    box.querySelector("#svfb-c").value = ""; rating = 0; paint(0);
    setTimeout(() => open(false), 1800);
  } catch { st.textContent = "გაგზავნა ვერ მოხერხდა. სცადეთ ცოტა ხანში."; st.classList.add("err"); }
  finally { send.disabled = false; }
});
