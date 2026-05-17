# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev        # start development server on localhost:3000
npm run build      # production build
npm run lint       # run ESLint

npx prisma generate          # regenerate Prisma client after schema changes
npx prisma db push           # push schema to database (dev)
npx prisma migrate dev       # create and apply a migration
npx prisma studio            # open Prisma GUI
npx prisma validate          # validate schema.prisma syntax
```

## Architecture

**Instagram clone** built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Clerk (auth), Prisma + PostgreSQL, Zod, and UploadThing.

### Route layout (planned)

```
app/
├── page.tsx                  # landing page + sign-in (public)
├── sign-up/                  # Clerk sign-up flow
├── verification/             # OAuth callback / email code verification
└── (main)/                   # route group — requires auth
    ├── layout.tsx            # shared layout with LeftSidebar
    ├── feed/                 # feed page
    ├── profile/              # own profile
    ├── profile/[username]/   # other users' profiles
    └── profile/edit/         # edit profile
```

Every route must have a co-located `loading.tsx` and `error.tsx`.

### Data layer

- Schema lives in `prisma/schema.prisma` — exactly **6 models**: `User`, `Post`, `Story`, `ViewedStory`, `Interaction`, `Notification`
- All database operations go in `server/actions/` as React Server Actions (`"use server"`)
- Path alias `@/` maps to the project root

### Key conventions

- Prefer server components; use `"use client"` only when interactivity requires it
- Avoid `useEffect` unless strictly unavoidable — prefer derived state and event-driven logic
- UI components from shadcn/ui; media uploads via UploadThing; forms validated with Zod
- Screenshots in `screenshots/` are the primary UI/UX reference — match them exactly
- Assets (logos, branding) are in `public/assets/`
