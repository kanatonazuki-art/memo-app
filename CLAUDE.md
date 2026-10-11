# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A memo (note-taking) app built with React 19 + Vite 8. The project is a fresh scaffold: `src/App.jsx` currently renders only a heading, and no memo features, state management, persistence, or routing exist yet.

User-facing text and the README are in Japanese (`<html lang="ja">`); keep new UI strings in Japanese.

## Commands

```
npm install
npm run dev       # Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the built dist/
npm run lint      # oxlint
```

There is no test runner configured, so there is no test command yet.

## Code conventions

- Plain JavaScript with JSX (`.jsx`), ES modules (`"type": "module"`). There is no TypeScript config; `@types/react*` are installed only for editor IntelliSense.
- Linting is oxlint (not ESLint), configured in `.oxlintrc.json` with the `react` and `oxc` plugins. `react/only-export-components` is enabled, so component files should export only components (constant exports are allowed) to keep Fast Refresh working.
- Existing source uses no semicolons, single quotes, and 2-space indentation. No formatter is configured, so match this by hand.
- Global styles live in `src/index.css`, imported once from `src/main.jsx`. No CSS framework or CSS-in-JS library is installed.

## Structure

`index.html` → `src/main.jsx` (mounts `<App />` in `StrictMode` on `#root`) → `src/App.jsx`. `vite.config.js` uses only `@vitejs/plugin-react` with defaults.

The directory is not currently a git repository.
