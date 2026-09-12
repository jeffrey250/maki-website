// Prerender the JS-rendered pages into their index.html files.
//
// Why: every page whose body is just <div id="app"></div> is empty to any
// crawler that does not run JavaScript — which is most AI crawlers (GPTBot,
// ClaudeBot, PerplexityBot) and the first pass of Googlebot. This bakes the
// rendered markup into the HTML so those crawlers see the real content. The
// browser still runs app.js and re-renders the same markup over the top, so
// nothing changes for visitors and the site stays build-step-free to serve.
//
// Run it after editing content in app.js:
//
//   node prerender.mjs
//
// Pages that already hold real static HTML (services/*, case-studies/*,
// tools/*) are left alone.

import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = dirname(fileURLToPath(import.meta.url));

// Routes to prerender: [url path, file to write].
const ROUTES = [
  ["/", "index.html"],
  ["/about/", "about/index.html"],
  ["/blog/", "blog/index.html"],
  ["/services/", "services/index.html"],
  ["/solutions/", "solutions/index.html"],
  ["/products/", "products/index.html"],
  ["/vehicles/", "vehicles/index.html"],
  ["/recreational/", "recreational/index.html"],
  ["/enquire/", "enquire/index.html"],
];

// app.js ends with a render() call that needs a live DOM; drop it and call the
// page builders directly instead — they are pure string functions.
const source = readFileSync(join(root, "app.js"), "utf8").replace(/render\(\);\s*$/, "");

const noop = () => {};

// app.js bakes asset() paths into its top-level data using pathPrefix(), which
// reads location.pathname — so each route needs its own freshly evaluated
// context with the path already set, exactly as a browser load would see it.
function contextFor(path) {
  const el = { innerHTML: "", textContent: "", style: {}, classList: { add: noop, remove: noop, toggle: noop }, addEventListener: noop, querySelector: () => null, querySelectorAll: () => [], appendChild: noop, setAttribute: noop, getAttribute: () => null };
  const sandbox = {
    location: { pathname: path, search: "", href: "https://www.maki.nz" + path },
    document: { getElementById: () => el, querySelector: () => null, querySelectorAll: () => [], createElement: () => el, body: el, head: el, addEventListener: noop, documentElement: el },
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    navigator: { clipboard: null },
    IntersectionObserver: class { observe() {} disconnect() {} },
    URLSearchParams,
    console,
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  const ctx = vm.createContext(sandbox);
  vm.runInContext(source, ctx, { filename: "app.js" });
  return ctx;
}

// Every post/<slug>/index.html is driven by the same posts data in app.js.
for (const slug of vm.runInContext("posts.map(p => p.slug)", contextFor("/"))) {
  ROUTES.push([`/post/${slug}/`, `post/${slug}/index.html`]);
}

const ORIGIN = "https://www.maki.nz";

// JSON-LD is valid anywhere in the document, so it is emitted with the body
// rather than surgically inserted into each hand-maintained <head>. That keeps
// it regenerating in step with the content it describes.
//
// Note there is deliberately no VideoObject markup for the home page's video
// grid: those are links to YouTube, not players embedded on the page, and
// Google's structured data guidelines treat marking up a video that a visitor
// cannot watch on the page as spam.
function schemaFor(path, ctx) {
  const graph = [];
  const crumbs = [{ name: "Home", item: ORIGIN + "/" }];

  if (path.startsWith("/post/")) {
    const post = vm.runInContext(`getPosts().find(p => p.slug === ${JSON.stringify(path.split("/")[2])}) || null`, ctx);
    if (!post) return "";
    crumbs.push({ name: "News & Articles", item: `${ORIGIN}/blog/` }, { name: post.title, item: ORIGIN + path });
    graph.push({
      "@type": "BlogPosting",
      "@id": ORIGIN + path + "#article",
      headline: post.title,
      description: post.excerpt,
      image: ORIGIN + "/assets/media/" + post.image.split("/assets/media/")[1],
      articleSection: post.category,
      // No datePublished: the post dates in app.js carry no year ("Apr 7"), and
      // inventing one to satisfy the schema would be worse than omitting it.
      author: { "@id": ORIGIN + "/#organization" },
      publisher: { "@id": ORIGIN + "/#organization" },
      mainEntityOfPage: ORIGIN + path,
      inLanguage: "en-NZ",
    });
  } else if (path !== "/") {
    const label = { "/about/": "About", "/blog/": "News & Articles", "/services/": "Services", "/solutions/": "Solutions", "/products/": "Products", "/vehicles/": "Our Vehicles", "/recreational/": "Recreational", "/enquire/": "Enquire" }[path];
    if (!label) return "";
    crumbs.push({ name: label, item: ORIGIN + path });
  } else {
    return ""; // home already carries its full graph in the head
  }

  graph.push({
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
  });

  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}</script>`;
}

function renderRoute(path) {
  const ctx = contextFor(path);
  const body = vm.runInContext(
    `(function(){
       const map={services:servicesPage,solutions:solutionsPage,products:productsPage,recreational:recreationalPage,vehicles:vehiclesPage,about:aboutPage,enquire:enquirePage,blog:blogPage,post:postPage};
       const page=currentPage();
       return nav()+(map[page]?map[page]():home())+footer();
     })()`,
    ctx
  );
  return body + schemaFor(path, ctx);
}

let written = 0;
for (const [path, file] of ROUTES) {
  const full = join(root, file);
  let html;
  try {
    html = readFileSync(full, "utf8");
  } catch {
    console.warn(`skip (missing): ${file}`);
    continue;
  }

  // Match the whole app container, however much markup is already inside it.
  const container = /<div id="app">[\s\S]*<\/div>(\s*<\/body>)/;
  if (!container.test(html)) {
    console.warn(`skip (no #app container): ${file}`);
    continue;
  }

  // Replacer must be a function so $-sequences in the rendered markup are not
  // treated as substitution patterns — which also means building the tail from
  // the captured group rather than writing "$1".
  const body = renderRoute(path);
  const next = html.replace(container, (_match, tail) => `<div id="app">${body}</div>${tail}`);
  if (next !== html) {
    writeFileSync(full, next);
    written++;
  }
  console.log(`${path.padEnd(80)} ${body.length.toLocaleString()} chars`);
}

console.log(`\n${written} file(s) updated, ${ROUTES.length} route(s) rendered.`);

// ---------------------------------------------------------------------------
// sitemap.xml
//
// Generated here so it cannot drift out of step with the pages themselves.
// lastmod comes from the file's last commit date, falling back to today for
// anything not yet committed — so it stays honest rather than being a fixed
// date crawlers learn to ignore.
// ---------------------------------------------------------------------------

// [url path, file, changefreq, priority]. Static pages (services/*,
// case-studies/*) are listed explicitly since they are not prerendered above.
const SITEMAP = [
  ["/", "index.html", "weekly", "1.0"],
  ["/services/", "services/index.html", "monthly", "0.9"],
  ["/services/stormwater/", "services/stormwater/index.html", "monthly", "0.85"],
  ["/services/environmental/", "services/environmental/index.html", "monthly", "0.85"],
  ["/services/bathymetry/", "services/bathymetry/index.html", "monthly", "0.85"],
  ["/services/topography/", "services/topography/index.html", "monthly", "0.85"],
  ["/solutions/", "solutions/index.html", "monthly", "0.9"],
  ["/case-studies/", "case-studies/index.html", "monthly", "0.8"],
  ["/case-studies/lakes-mapping/", "case-studies/lakes-mapping/index.html", "yearly", "0.8"],
  ["/case-studies/aotea-harbour/", "case-studies/aotea-harbour/index.html", "yearly", "0.8"],
  ["/case-studies/algae-bloom/", "case-studies/algae-bloom/index.html", "yearly", "0.8"],
  ["/case-studies/ngaroto/", "case-studies/ngaroto/index.html", "yearly", "0.8"],
  ["/case-studies/rov-reservoir/", "case-studies/rov-reservoir/index.html", "yearly", "0.8"],
  ["/case-studies/sediment-analysis/", "case-studies/sediment-analysis/index.html", "yearly", "0.8"],
  ["/products/", "products/index.html", "monthly", "0.8"],
  ["/vehicles/", "vehicles/index.html", "monthly", "0.8"],
  ["/recreational/", "recreational/index.html", "monthly", "0.7"],
  ["/about/", "about/index.html", "monthly", "0.7"],
  ["/blog/", "blog/index.html", "weekly", "0.8"],
  ["/enquire/", "enquire/index.html", "yearly", "0.6"],
];
for (const [path, file] of ROUTES.filter(([p]) => p.startsWith("/post/"))) {
  SITEMAP.push([path, file, "yearly", "0.6"]);
}

const today = new Date().toISOString().slice(0, 10);
function lastModified(file) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], { cwd: root, encoding: "utf8" }).trim();
    return out || today;
  } catch {
    return today;
  }
}

const entries = SITEMAP.map(([path, file, changefreq, priority]) =>
  `  <url><loc>https://www.maki.nz${path}</loc><lastmod>${lastModified(file)}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
).join("\n");

writeFileSync(
  join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
);
console.log(`sitemap.xml written with ${SITEMAP.length} urls.`);

// ---------------------------------------------------------------------------
// Cache busting
//
// Pages had drifted to three different ?v= values for the same two files, so a
// returning visitor could be served a stale app.js while another page served a
// fresh one. Stamping every page with a hash of the file's actual contents
// keeps them in step: the query string changes when — and only when — the file
// does.
// ---------------------------------------------------------------------------

const hash = (file) => createHash("sha1").update(readFileSync(join(root, file))).digest("hex").slice(0, 8);
const versions = { "app.js": hash("app.js"), "styles.css": hash("styles.css") };

let stamped = 0;
for (const file of [...new Set([...SITEMAP.map(([, f]) => f), "404.html", "privacy/index.html", "kayaksolo/index.html"])]) {
  let html;
  try {
    html = readFileSync(join(root, file), "utf8");
  } catch {
    continue;
  }
  const next = html.replace(
    /((?:href|src)="[^"]*?\/?)(app\.js|styles\.css)(?:\?v=[^"]*)?"/g,
    (_m, prefix, name) => `${prefix}${name}?v=${versions[name]}"`
  );
  if (next !== html) {
    writeFileSync(join(root, file), next);
    stamped++;
  }
}
console.log(`cache-bust stamped ${stamped} file(s): app.js?v=${versions["app.js"]}, styles.css?v=${versions["styles.css"]}`);
