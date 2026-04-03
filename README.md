# Glazebench

React + Vite + Convex application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Convex:
```bash
npx convex dev
```

This will:
- Create a new Convex project (or link to existing)
- Generate your `VITE_CONVEX_URL` 
- Start the Convex dev server

3. Add the Convex URL to `.env.local`:
```bash
VITE_CONVEX_URL=<your-url-from-convex-dev>
```

4. Start the dev server:
```bash
npm run dev
```

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Convex** - Backend & database
