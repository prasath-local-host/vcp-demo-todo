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

## Separate SSH demo ports

Daylist's VCP pipeline uses Stage at `http://localhost:3111` and Prod at
`http://localhost:3110`, alongside the original demo on 3101/3100. The platform
operator must install the separate Daylist pipeline binding before these ports
serve the application. The VCP platform repository owns `todo-build.yml`,
`todo-deploy.yml`, and the Daylist deployment setup; this repository does not
deploy itself. Health checks report the runtime `VCP_SOURCE_REVISION` to verify
that Stage and Prod serve the exact approved artifact.
