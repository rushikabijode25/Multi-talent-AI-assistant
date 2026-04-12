# Debales AI - Multi-tenant AI Assistant

This is a Full Stack Next.js App Router project that fulfills the multi-tenant AI assistant internship assignment requirements.

## Architecture & Multi-tenant Model

The API layers are strictly separated:
- **Routes (thin)**: `src/app/api/...` Validates Zod inputs, extracts auth, calls Services.
- **Services (Business Logic)**: `src/services/` Handlers core AI decisions, mock integration steps, database mutation.
- **Access (Pure Rules)**: `src/access/index.ts` Evaluates whether a `user` can view a `project` or its `admin_dashboard`.
- **Database (Mongoose/MongoDB)**: `src/models/` Strong types aligned with Zod. The tenant boundary is rooted at `Project` (`slug`). `ProductInstances` and `Conversations` belong to Projects. `Users` have per-project roles.

## Config-Driven Admin Dashboard
The Admin Dashboard (`/demo/admin`) is completely driven by a document stored in the `adminconfigs` MongoDB collection.
It reads a `.layout` array and passes it to `WidgetRenderer` which dynamically swaps and configures cards (StatCards, ChartWidget, etc.) without altering the frontend code.

## Setup Instructions

1. Ensure Node.js and NPM/Yarn are installed.
2. Run `npm install` inside the project folder.
3. Start a local MongoDB instance.
4. Copy `.env.example` to `.env.local` and configure your `MONGODB_URI` and optional `GEMINI_API_KEY`.
5. Run the database seed by pasting this snippet into a temporary Node script or requesting the `/api/seed` route.
   - You can `curl -X POST http://localhost:3000/api/seed` once the server is started to initialize the project and user data.
6. Run the local development server with `npm run dev`.
7. Navigate to `http://localhost:3000` which redirects to the generated `demo` workspace.

## Editing Dashboard Config
1. Open MongoDB Compass.
2. Navigate to the `debales-ai` database -> `adminconfigs` collection.
3. Edit the `layout` array (add/remove objects or change `colSpan`, `title`, etc.) and refresh the page to see changes.
