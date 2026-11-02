# Photo Gallery

A React + Vite + Tailwind CSS gallery that loads 30 photos from the Picsum Photos API,
filters them by author as you type, and lets you keep favourites that survive a refresh.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR. |
| `npm run build` | Production bundle into `dist/`. |
| `npm run preview` | Serves the built bundle locally. |
| `npm run lint` | Oxlint (ships with the Vite React template). |

Stack: React 19, Vite 8, Tailwind CSS v4 through `@tailwindcss/vite`. No component library,
no CSS framework other than Tailwind, no icon package — the search and heart icons are inline
SVG.

## What maps to which requirement

| # | Requirement | Where |
| --- | --- | --- |
| 1 | React + Vite + Tailwind, nothing else | `package.json`, `vite.config.js`, `src/index.css` |
| 2 | Fetch 30 photos, loading spinner, error message | `src/hooks/useFetchPhotos.js` |
| 3 | Responsive grid — 1 / 2 / 4 columns, card with photo + author + heart | `src/components/Gallery.jsx`, `src/components/PhotoCard.jsx` |
| 4 | Real-time author search, no reload, no extra API call | `src/components/SearchBar.jsx` + `useMemo` in `Gallery.jsx` |
| 5 | Favourites via `useReducer`, persisted in `localStorage` | `src/favourites.js`, `src/App.jsx` |
| 6 | `useFetchPhotos` returns `{ photos, loading, error }`, used by `Gallery` | `src/hooks/useFetchPhotos.js` |
| 7 | `useCallback` on the search handler, `useMemo` on the filtered list | `src/App.jsx`, `src/components/Gallery.jsx` |

## How the data flows

```
App ── owns query state + useReducer favourites (hydrated from localStorage, written back on change)
 ├── SearchBar ── controlled input, calls the useCallback'd handler
 └── Gallery ── calls useFetchPhotos() → { photos, loading, error }
      └── useMemo(photos, query) → PhotoCard[] → PhotoCard (heart toggles via one shared handler)
```

`Gallery` is the only component that touches the feed, and the only place `fetch` happens is
inside the hook. Search never re-requests: it filters the array already in memory, so typing is
free.

## Why `useCallback` and `useMemo` here

- **`useMemo` for the filtered list.** `Array.prototype.filter` over the photo array would run
  on every render of `Gallery`, and `Gallery` re-renders on every keystroke *and* whenever the
  favourites reducer dispatches. Memoising on `[photos, query]` means the filter only re-runs
  when one of those two inputs actually changes — favouriting a photo re-renders the grid but
  does not re-filter it.
- **`useCallback` for the search handler.** The handler is passed down into `SearchBar`. Without
  `useCallback` a new function identity is created on every `App` render, which defeats any
  `React.memo` on the child and invalidates memoised work that depends on it below. With it, the
  handler identity is stable for the component's lifetime, so `SearchBar` sees an unchanged prop.
- **The same reasoning covers `toggleFavourite`**, passed two levels down to every `PhotoCard`,
  and `useReducer` over `useState` for favourites: the transition (add if absent, remove if
  present) is a pure function of state plus action, so it belongs in a reducer that can be tested
  without rendering and hydrated from or written back to `localStorage` in one place.

## Notes and decisions

- **Image URLs are built from the photo `id`** (`https://picsum.photos/id/${id}/600/400`). In the
  `/v2/list` response the `url` field points at the Unsplash source page, not an image, and
  `download_url` returns the original resolution — far too heavy for a grid tile.
- **The fetch is aborted on cleanup.** `useEffect` returns `controller.abort()`, so the
  double-invoked effect under React StrictMode in development cannot leave a stale request
  behind, and only a real failure reaches the error state.
- **`loading` and `error` are separate states**, never derived from `photos.length`, so an empty
  feed and a failed feed are distinguishable in the UI.
- **Favourites store ids, not photo objects.** The API supplies the rest, which keeps
  `localStorage` small and avoids showing stale metadata for a photo whose author changed.
- **Storage access is defensive.** Reading guards against corrupt or non-array JSON, writing
  swallows a quota or blocked-storage failure — a preference store must never take the gallery
  down with it.
- **Search matches author name only**, case-insensitively and trimmed, as specified; no results
  gets its own message rather than a blank grid.
