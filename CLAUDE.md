# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (configured via PostCSS, not `tailwind.config.js`)
- **Geist** font family (sans + mono) loaded via `next/font/google`

## Architecture

This is a fresh Next.js App Router project — the lifting diary feature set has not yet been built. The entry points are:

- `src/app/layout.tsx` — root layout with font variables and `min-h-full flex flex-col` body
- `src/app/page.tsx` — home page (currently the default create-next-app template)
- `src/app/globals.css` — global styles

New routes go in `src/app/` following the App Router file conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, etc.). Server Components are the default; add `"use client"` only when browser APIs or React hooks are needed.
