import { t } from "../i18n.js";
import { mountChrome, translateStatic, $ } from "../ui.js";
mountChrome("home"); translateStatic();
const url = new URL("index.html", location.href); url.search = ""; url.hash = "";
const text = url.toString();
$("#url").textContent = text;
function draw() {
  if (!window.qrcode) return false;
  const q = window.qrcode(0, "M"); q.addData(text); q.make();
  $("#qr").innerHTML = q.createSvgTag({ cellSize: 6, margin: 0, scalable: true });
  const svg = $("#qr svg"); svg.setAttribute("width", "260"); svg.setAttribute("height", "260"); svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "QR code: " + text);
  return true;
}
if (!draw()) { const s = document.createElement("script"); s.src = "assets/vendor/qrcode.js"; s.onload = draw; document.head.appendChild(s); }
$("#print").addEventListener("click", () => window.print());
