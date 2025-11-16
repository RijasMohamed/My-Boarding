## Repo snapshot & purpose

This repository currently contains very little source material (no obvious `package.json`, `pyproject.toml`, `src/` or `README.md`). The only editor file visible in the workspace is `.vscode/extensions.json`.

If you (the human) asked an AI agent to work here, first confirm the intended project type (Node / Python / .NET / static site / other) and where the real source lives if it is not checked in.

## Primary objective for an AI coding agent

- Quickly discover the real entry points, build and test commands.
- Avoid making large, irreversible changes without an explicit user OK — propose scaffolding first.

Note: This repo currently contains a minimal scaffold added by an AI agent: a Django backend stub under `boarding_house/` and a React frontend skeleton under `boarding-frontend/`. The scaffold uses SQLite and in-memory Channels by default for quick local testing.

## Steps the agent should take immediately

1. Run a workspace-wide search for common entry files (in order): `package.json`, `pyproject.toml`, `requirements.txt`, `setup.py`, `Pipfile`, `Cargo.toml`, `build.gradle`, `csproj`, `README.md`, and top-level `src/` or `app/` directories. Report back results and ask the user which language/runtime is primary.
2. Inspect `.vscode/extensions.json` and other dotfiles to infer preferred tooling (formatters, linters, test runners). If these files are present, follow their recommendations.
3. If no source files exist, propose a minimal scaffold with the user's approval (include dependency manifest, README, and one small test). Provide a step-by-step plan and a single PR that implements the scaffold.

## When you modify or scaffold code

- Keep changes minimal and atomic. Create a descriptive PR title like: `chore: add initial Node scaffold (package.json, src/, README)`.
- Include a short PR body with: what changed, why, how to run locally, and at least one example of a smoke test command.

## How to find build / test / debug commands

- Look for the following files (first match is often authoritative): `package.json` (scripts), `pyproject.toml` or `tox.ini`, `Makefile`, `.github/workflows/**`, and any CI config files. Use them to populate the README and PR notes.
- If none of the above exist, ask the user: "How should I build/run/test this project locally?" and propose a default (e.g., `npm init -y && npm test` for Node) only after confirmation.

Repository-specific quick run notes (scaffold added):

- Backend (Django):
  - Create and activate a venv, install `requirements.txt` in `boarding_house/`, run `python manage.py migrate`, create a superuser, and run with `python manage.py runserver` or with Daphne: `daphne -b 0.0.0.0 -p 8000 boarding_house.asgi:application`.
  - API root is under `/api/`; JWT endpoints under `/api/auth/token/` and `/api/auth/token/refresh/`.
  - WebSocket endpoint (Channels) available at `ws://<host>/ws/notifications/` (in-memory channel layer by default).

- Frontend (React + Tailwind):
  - Install dependencies in `boarding-frontend/` with `npm install` and run `npm start`.
  - The frontend expects an env var `REACT_APP_API_BASE` (defaults to `http://localhost:8000/api`).

## Project-specific conventions (discoverable patterns)

- Use repository files to decide conventions. Examples:
  - If `.vscode/extensions.json` includes Prettier or ESLint, respect that style.
  - If `.editorconfig` exists, follow its rules for line endings/indentation.

Project patterns added by the scaffold:

- Backend: `core/` app contains models, serializers, viewsets, and a `core/routing.py` for WebSocket paths. Look at `boarding_house/boarding_house/asgi.py` for Channels configuration and `boarding_house/requirements.txt` for required packages.
- Frontend: `src/services/api.js` centrally manages Axios requests and injects JWT from localStorage. Start with `src/pages/Members.js` as an example of CRUD consumption of the API.

## Integration points & external dependencies

- Don't attempt to call or configure remote services (databases, cloud APIs) without user-provided credentials or explicit instructions. Instead, stub integrations and document how to wire real credentials.

## Examples of actionable prompts for a human when info is missing

- "I couldn't find a package manifest or source files. Do you want me to scaffold a Node project, a Python project, or wait for you to add existing sources?"
- "I found `.vscode/extensions.json` referencing Prettier; do you want formatting enforced with Prettier on save?"

## Merging guidance (if `.github/copilot-instructions.md` already exists)

- Preserve any human-authored sections. When merging, add a short note under a new heading `AI-updates (YYYY-MM-DD)` describing what the agent changed and why.

## Closing / ask-for-feedback

If any of the above is unclear or the repository has hidden folders I couldn't access, tell me where the source code lives or paste the key files (package manifest, build scripts, or README) and I will update this file with concrete build/test/debug commands and examples.
