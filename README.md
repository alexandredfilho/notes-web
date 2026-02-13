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
<img width="960" height="271" alt="Screenshot from 2026-02-11 19-57-34" src="https://github.com/user-attachments/assets/3c71aa4f-6639-4f61-a465-51441c1ab9db" />


## Tests
```bash
npm test
```

## Features
- Create, list, update and delete notes
- JSON:API response mapping
- i18n (pt-BR/en) with localStorage persistence
- Toast notifications for success and error states
