

## Tech Stack

- Next.js 15 
- React 19
- TypeScript
- Redux Toolkit + Redux Persist
- Tailwind CSS
- Firebase Email/Password
- Testing: Jest + React Testing Library, Cypress E2E

## Getting Started

### Install
```bash
npm install
```

### Run Dev Server
```bash
npm run dev

```


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


