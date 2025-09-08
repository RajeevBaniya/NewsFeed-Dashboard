# PersonalFeed
Modern, personalized content dashboard built with Next.js 15, React 19, TypeScript, Redux Toolkit and Tailwind. Features unified content feed, search/filtering, favorites and draggable ordering with persistence. Includes unit, integration and E2E tests.

## Tech Stack

- Next.js 15 
- React 19
- TypeScript
- Redux Toolkit + Redux Persist
- Tailwind CSS
- Firebase Email/Password
- Data sources: News API, TMDB, Spotify, social (local JSON)
- Testing: Jest + React Testing Library, Cypress E2E

## Getting Started

### Install
```bash
npm install
```

### Environment Variables
Create `.env.local` in the project root. For local development you can start with dummy values:
```bash
NEXT_PUBLIC_TMDB_API_KEY=.....
NEXT_PUBLIC_NEWS_API_KEY=.....
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=....
```
You can replace with real keys when available.

### Run Dev Server
```bash
npm run dev

```

## Scripts
- `npm run dev` – Start Next.js dev server
- `npm test` – Jest unit + integration tests
- `npm run cy:open` – Open Cypress GUI
- `npm run e2e` – Start server and run Cypress E2E headless (Windows-friendly)

## Testing Guide

### Unit & Integration (Jest + RTL)
```bash
npm test
```
Tests live under `src/tests` and cover slices, utilities, components, and integration (`MainContent`).

### E2E (Cypress)
Headless (recommended):
```bash
npm run e2e
```
Interactive GUI:
```bash
npm run dev
npm run cy:open
# run specs in src/tests/e2e
```


## Authentication
- Firebase Email/Password auth
- Required env :
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`

## Features
- content feed (News, Movies, Music, Social)
- Search with debounce, filters, sort
- Favorites with persistence
- Drag-and-drop ordering with Save/Discard
- Trending section and infinite scroll
- Dark mode, responsive layout

## User Flow
- Landing redirects to `Feed` where initial content is loaded.
- Use the search bar to filter across all loaded items; refine by type/sort.
- Toggle "View" to switch between normal and draggable modes; drag cards to reorder and click "Save Changes".
- Click the heart on a card to add/remove favorites; view them in `Favorites`.
- Open `Trending` to see curated items aggregated from multiple sources.

## Repository Structure
```
src/
  app/           # Next.js App Router pages and API route
  components/    # UI + feature components
  hooks/         # Reusable React hooks
  store/         # Redux Toolkit slices and store
  utils/         # API helpers and utilities
  tests/         # Jest + RTL tests and Cypress E2E specs
```

## Architecture

- Routes: `/feed`, `/trending`, `/favorites` (Next.js App Router)
- Shell: `components/layout/Dashboard.tsx`
- Content orchestrator: `components/content/MainContent.tsx`
- Feature components:
  - Feed: `FeedHeader`, `UnifiedFeedGrid`, `DraggableFeed`, `InfiniteLoader`, `ContentCard`, `ContentModal`
  - Search: `SearchHeader`, `SearchSections`, `SearchEmpty`
  - Favorites: `FavoritesSection`
  - Trending: `TrendingSection`
- Hooks: `useInitialContentLoad`, `useFeedPaging`, `useTrendingOnView`, `useModalState`, `useInfiniteScroll`
- State: Redux Toolkit + Persist (`preferences`, `feed`, `favorites`, `search`)

