# Daylist — demo to-do app

A customer-neutral task list for a VCP demonstration. Add, edit, complete, filter, and delete tasks; undo the most recent deletion. Includes synthetic example tasks on first use.

## Run

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` followed by `npm start`.

## Validation

```sh
npm run typecheck
npm run build
```

## VCP deployment

Repository: https://github.com/prasath-local-host/vcp-demo-todo

Register this repository under company-b in the VCP portal. A standalone Next.js build and non-root Dockerfile are included. The container listens on port 3000; `/api/health` and `/api/ready` return HTTP 200. Deploy through the VCP workflow configured for this application. No credentials or external services are required.

Tasks are stored in localStorage in the current browser and origin. They survive refresh but are not shared across browsers, users, or Stage/Prod origins. Clearing site data removes them. This is a single-browser demo, without accounts or a backend database. Do not enter private customer data.
