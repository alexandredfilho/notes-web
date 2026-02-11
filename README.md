# Notes Web

Vue 3 + Vite + Tailwind frontend for the Notes API (TypeScript).

## Setup
```bash
cd notes-web
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## API configuration
The frontend uses the base URL `http://localhost:3000/api/v1` (see `src/core/api/index.ts`).

## Type checking
```bash
npm run typecheck
```

## Features
- Create, list, update and delete notes
- JSON:API response mapping
- i18n (pt-BR/en) with localStorage persistence
- Toast notifications for success and error states
