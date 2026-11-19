const SAFE_TARGETS = Object.freeze({
  "/": "/",
  "/vault": "/vault",
  "/#fameBoardSection": "/#fameBoardSection",
});

function runRedirect() {
  const raw =
    (document.body && document.body.getAttribute("data-target")) ||
    document.documentElement.getAttribute("data-target") ||
    "/";
  const dest = Object.prototype.hasOwnProperty.call(SAFE_TARGETS, raw)
    ? SAFE_TARGETS[raw]
    : "/";
  let querySuffix = "";
  if (dest === "/vault" || dest === "/") {
    const incoming = new URLSearchParams(window.location.search);
    const safeOut = new URLSearchParams();
    const seat = incoming.get("seat");
    if (seat && /^\d{1,6}$/.test(seat)) safeOut.set("seat", seat);
    const buy = incoming.get("buy");
    if (buy === "1") safeOut.set("buy", "1");
    const qs = safeOut.toString();
    if (qs) querySuffix = "?" + qs;
  }
  window.location.replace(dest + querySuffix);
}

if (document.body) {
  runRedirect();
} else {
  window.addEventListener("DOMContentLoaded", runRedirect, { once: true });
}
