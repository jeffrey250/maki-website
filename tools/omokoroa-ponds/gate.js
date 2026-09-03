// ── Accounts ──
// One login per person, so the sign-in log can tell them apart.
//
//     u2 = Jeffrey (MAKI)
//     u3 = Kyna Kruithoed (Western Bay of Plenty District Council)
//
// u1 is Kees Beentjes on the Klondyke tool -- a different client, a different
// job. Codes stay unique per person across both, so a code always means one
// person.
//
// ── Why this is not the same as gate_block.js ──
// That one stored an unsalted SHA-256. SHA-256 is built to be fast, so a hash
// of a human-chosen password is recoverable from a public rainbow table in
// seconds without any guessing -- which is exactly what happened to
// `klondyke2026`.
//
// These are PBKDF2-HMAC-SHA256, 600,000 iterations, with a random salt per
// person. The salt means no precomputed table can help, and the iteration count
// means each guess costs real work rather than a microsecond. With a strong
// password the hash is no longer the way in.
//
// To add someone: python portal/make_hash.py, paste the row it prints, give
// them a new code. Reusing a code makes two people indistinguishable, which is
// the whole thing this is here to avoid.
//
// ── The limit, stated plainly ──
// This is a front door, not a lock. The page and its data reach the browser
// before the gate is answered, so someone who opens developer tools can still
// read them -- setting the session flag by hand walks straight past this. What
// changed is that the *password* can no longer be lifted out of the file. If
// the survey data ever needs protection from a determined reader, the data
// itself has to be encrypted (see DEPLOY.md).
const USERS = [
  {
    user: "kyna", code: "u3",
    salt: "8d6c6836147a3f71a9fd9a9ca5d619c7", iters: 600000, hash: "7f8c142555b6f5300257fe554b6b15d9c42d500908e9a46d0b26acfa7a7658f8"
  },
  {
    user: "jeffrey", code: "u2",
    salt: "24801e1ce50b0008028c1e8fb0fe648b", iters: 600000, hash: "f078bdfdc11c7232af7b79eb5685eae7483c3c65d5abbf4ca587eb27821e75f3"
  }
];

const PORTAL_TOOL = "omokoroa_pond_portal";

// ── Notification ──
// Static pages cannot send mail, so this posts to an endpoint you own.
// portal/notify_appscript.gs is a Google Apps Script that emails you; paste its
// /exec URL here. Left empty, nothing is sent and nothing breaks.
const NOTIFY_URL = "";
const NOTIFY_USERS = ["kyna"];   // your own sign-ins are not worth an email

function _hex(buf) {
  return Array.from(new Uint8Array(buf))
    .map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
}

function _bytes(hex) {
  var a = new Uint8Array(hex.length / 2);
  for (var i = 0; i < a.length; i++) a[i] = parseInt(hex.substr(i * 2, 2), 16);
  return a;
}

async function derive(password, saltHex, iters) {
  var base = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  var bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: _bytes(saltHex), iterations: iters, hash: "SHA-256" },
    base, 256);
  return _hex(bits);
}

async function checkLogin() {
  var btn = document.querySelector("#login-gate button");
  var u = document.getElementById("login-user").value.trim().toLowerCase();
  var p = document.getElementById("login-pass").value;
  var err = document.getElementById("login-error");

  // 600k iterations is deliberately not instant; say so rather than look frozen.
  btn.disabled = true;
  btn.textContent = "Checking…";
  err.textContent = "";

  var found = null;
  for (var i = 0; i < USERS.length; i++) {
    var a = USERS[i];
    if (a.user !== u) continue;
    try {
      if (await derive(p, a.salt, a.iters) === a.hash) found = a;
    } catch (e) { }
    break;
  }

  btn.disabled = false;
  btn.textContent = "Sign in";

  if (found) {
    sessionStorage.setItem("maki_portal_auth", "1");
    sessionStorage.setItem("maki_portal_user", found.code);
    document.getElementById("login-gate").classList.add("hidden");
    trackSignin(found.code);
    notifySignin(found.user, found.code);
  } else {
    err.textContent = "Incorrect username or password.";
    document.getElementById("login-pass").value = "";
  }
}

// Fires once per actual sign-in, not on every page load, so the count means
// "someone opened the portal" rather than "someone refreshed". Inert unless a
// Google Analytics tag is on the page; none is added by default.
function trackSignin(code) {
  try {
    if (typeof gtag === "function") {
      gtag("event", "tool_signin", { maki_user: code, tool: PORTAL_TOOL });
      gtag("set", { user_properties: { maki_user: code } });
    }
  } catch (e) { }
}

// Fire-and-forget: a slow or unreachable endpoint must never delay the page.
// sendBeacon survives the tab being closed straight after signing in.
function notifySignin(user, code) {
  try {
    if (!NOTIFY_URL) return;
    if (NOTIFY_USERS.length && NOTIFY_USERS.indexOf(user) === -1) return;
    var body = JSON.stringify({
      user: user, code: code, tool: PORTAL_TOOL,
      at: new Date().toISOString(),
      page: location.pathname.split("/").pop() || "index.html"
    });
    navigator.sendBeacon(NOTIFY_URL,
      new Blob([body], { type: "text/plain;charset=utf-8" }));
  } catch (e) { }
}

(function () {
  // Signed in already? Stay signed in across the eleven pond pages for this
  // browser session, or every click from the index would ask again.
  if (sessionStorage.getItem("maki_portal_auth") === "1") {
    document.getElementById("login-gate").classList.add("hidden");
    try {
      var c = sessionStorage.getItem("maki_portal_user");
      if (c && typeof gtag === "function") gtag("set", { user_properties: { maki_user: c } });
    } catch (e) { }
    return;
  }
  document.getElementById("login-pass").addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkLogin();
  });
  document.getElementById("login-user").addEventListener("keydown", function (e) {
    if (e.key === "Enter") document.getElementById("login-pass").focus();
  });
  document.getElementById("login-user").focus();
})();
