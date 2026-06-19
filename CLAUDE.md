# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
yarn install

# Build assets and serve with live reload (default dev workflow)
gulp

# Build only (no watch/browser-sync)
gulp jekyll-build

# Compile SCSS → assets/css/main.css
gulp sass

# Compile and minify JS → assets/js/main.js
gulp js
```

Jekyll must be installed separately (`gem install jekyll`). The Gulp workflow builds Jekyll and assets together.

## Architecture

This is a single-page Jekyll portfolio site deployed to GitHub Pages on the `gh-pages` branch (which is also the main branch).

**Source vs. built assets:**
- `src/styles/` — SCSS source; `main.scss` imports all partials. Gulp compiles → `assets/css/main.css`.
- `src/js/` — JS source; Gulp concatenates and minifies → `assets/js/main.js`.
- `src/fonts/` — copied verbatim to `assets/fonts/`.
- `assets/` — committed built files served directly by Jekyll/GitHub Pages.

**Jekyll structure:**
- `_layouts/default.html` — single layout wrapping all pages.
- `_includes/` — header (hero), footer, head (meta/CSS/JS), projects card grid.
- `index.html` — the only page; just includes `projects.html`.
- `_data/projects.json` — drives the "Recent Activity" project cards. This file is auto-updated monthly by the GitHub Actions workflow (`.github/workflows/update-projects.yml`), which fetches the 3 most recently updated repos via the GitHub API using a `GH_PROJECTS_PAT` secret.
- `_config.yml` — site metadata (name, email, GitHub username, GA ID).

**Visual theme:**
The hero (`_includes/header.html`) uses a synthwave/Tron aesthetic with pure-CSS animated elements: `tron-bg`, `tron-sun`, `tron-grid`, `tron-stars`, `tron-palm`. Styles live in `src/styles/_tron.scss`.
