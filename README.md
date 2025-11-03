# Next.js Frontend — Django Dashboard Role Access

This is the Next.js 14 (App Router) frontend for the Django Dashboard Role Access project. It provides a role-based admin dashboard that integrates with a Django backend API.

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- React 18
- Styling: CSS (global styles)
- HTTP: Fetch via a small API client
- Containerization: Docker & Docker Compose
- Package manager: bun (lockfile included)

## Project Structure
```
app/
  layout.tsx              # Root layout (App Router)
  page.tsx                # Landing page
  login/page.tsx          # Login page
  dashboard/
    layout.tsx            # Dashboard layout (with sidebar)
    page.tsx              # Dashboard index
    users/page.tsx        # Users table page
    products/page.tsx     # Products table page
    orders/page.tsx       # Orders table page
    invitations/page.tsx  # Invitations table page
    error.tsx             # Error boundary for dashboard routes
  accept/page.tsx         # Invitation acceptance page
components/
  Header.tsx, Footer.tsx, Sidebar.tsx, SidebarDrawer.tsx, Logout.tsx
services/
  apiClient.ts            # Base API client with auth header logic
  authService.ts          # Auth actions (login/logout, tokens)
  userService.ts          # Users fetch API wrappers
  productService.ts       # Products fetch API wrappers
  orderService.ts         # Orders fetch API wrappers
  invitationService.ts    # Invitations fetch API wrappers
styles/
  globals.css             # Global styles
public/                   # Static assets
```

## Prerequisites
- Node.js 18+ (or use Docker)
- bun (recommended) or npm/yarn
- A running Django backend API compatible with this frontend

## Environment Variables
Copy the example file and adjust values for your environment:

```
cp env.example .env
```

Common variables in `.env`:
- NEXT_PUBLIC_API_BASE_URL: Base URL of the Django backend (e.g. http://localhost:8000)
- NEXT_PUBLIC_APP_NAME: Optional app name for UI

These are read on the client and during build. Changing them requires a restart.

## Install & Run (Local)
Using bun:
```
bun install
bun dev
```

Using npm:
```
npm install
npm run dev
```

The app will be available at http://localhost:3000.

## Build & Start (Production)
Using bun:
```
bun run build
bun run start
```

Using npm:
```
npm run build
npm run start
```

## Docker
Build and run with Docker Compose:
```
docker compose up --build
```
This uses the provided Dockerfile and docker-compose.yml. Ensure your `.env` is present; environment values can be overridden in compose if needed.

### Dockerfile
- Multi-stage build with Node 18-alpine
- Installs dependencies, builds Next.js, then runs in a minimal runtime

### docker-compose.yml
- Exposes the app on port 3000 by default
- Passes through environment variables

## Authentication & API
- Token-based auth is handled in `services/authService.ts` and attached via `services/apiClient.ts`
- The frontend expects standard REST endpoints from the Django backend. Adjust the service files if your endpoints differ.

## Development Notes
- This project uses the App Router, so pages are colocated in `app/` and are server components by default unless a client boundary is added ('use client').
- Linting is configured via `eslint.config.mjs`.
- TypeScript config is in `tsconfig.json`.
- Proxy utilities may exist in `proxy.ts` if you want to route API requests during local dev (optional/use-case specific).

## Common Scripts
Check `package.json` for available scripts. Typical scripts include:
- dev: Start the dev server
- build: Production build
- start: Start the production server

## Troubleshooting
- 404s/Network errors: Verify `NEXT_PUBLIC_API_BASE_URL` and that the Django API is running and CORS allows requests from http://localhost:3000.
- Auth issues: Check token storage/expiry in `authService.ts` and request headers in `apiClient.ts`.
- Styles not applying: Ensure `app/globals.css` and `styles/globals.css` imports are present in the relevant layouts.

## License
This repository inherits the license of the parent project. If none is specified, assume All Rights Reserved.
