# MAKI website

The www.maki.nz static site (moved off Wix, deployed to GitHub Pages).

## Where this is

Moved here from `C:\Users\jeffrey\Downloads\MAKI website` on 22 August 2026, so
it can be worked on from more than one laptop.

- Working path: `M:\Maki\MAKI Development and Tools\MAKI website`
- `M:` maps `\\MAKI\ExternalDrive`; if the letter is not mapped on this laptop,
  use `\\MAKI\ExternalDrive\Maki\MAKI Development and Tools\MAKI website`.
- Any older note or script saying `Downloads\MAKI website` means this folder.

## First thing on a new laptop

git will refuse to run here until told to trust the share
(`fatal: detected dubious ownership in repository at ...` — an ownership-SID
mismatch, not corruption):

```bash
git config --global --add safe.directory "%(prefix)///MAKI/ExternalDrive/Maki/MAKI Development and Tools/MAKI website"
```

## Running it

Plain static files — no dependencies. Serve the folder and open it:

```bash
python -m http.server 8080
```

## After editing content in `app.js`

`app.js` renders the page client-side, which left most pages empty to crawlers
that do not run JavaScript — that is most AI crawlers (GPTBot, ClaudeBot,
PerplexityBot) and Googlebot's first pass. So the rendered markup is baked into
each `index.html`. Regenerate it whenever `app.js` content changes:

```bash
node prerender.mjs
```

That one command also rewrites `sitemap.xml` (with `lastmod` from git) and
re-stamps the `?v=` cache-busting hashes on `app.js` / `styles.css`. It is
idempotent — running it with nothing changed rewrites nothing. Serving the
site still needs no build step; this only runs when content changes.

Repo `jeffrey250/maki-website`; `CNAME` in the root is the GitHub Pages custom
domain, so leave it in place.

## Layout

Vanilla HTML/CSS/JS, no framework. Content lives as data in `app.js` and is
rendered into the page; media sits in `assets/media/`. Section folders
(`about/`, `blog/`, `case-studies/`, `enquire/`, `kayaksolo/`) each hold their
own `index.html`.

The brand colours, header/hero rules and the owner-editor details are in
Claude's memory for this project — see `MEMORY.md` there before restyling
anything.
