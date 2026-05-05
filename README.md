# Infomap Online

Infomap Online is a client-side web application for running
[Infomap](//github.com/mapequation/infomap) in the browser without any local
installation. All computation runs on the user's machine; no network data is
uploaded to a server. The browser runtime is built from the native Infomap code
with [Emscripten](//emscripten.org/), so it is slower than the standalone CLI.

The JavaScript web worker used by this site is published as
[`@mapequation/infomap`](//www.npmjs.com/package/@mapequation/infomap).

The public site lives at [mapequation.org/infomap](https://www.mapequation.org/infomap).

## Development

This repository targets Node.js 20 and `npm`.

```bash
nvm use
npm ci
npm run dev
```

## Verification

Run the same checks locally as in CI:

```bash
npx playwright install chromium
npm run verify
```

## CI/CD

- `CI` runs on every push and pull request. It installs dependencies, runs
  `check`, builds the static export, and executes the Playwright
  smoke test against the exported site.
- `Deploy` runs after a successful `CI` run on `master` and deploys the tested
  `out/` artifact over SSH with `rsync --delete`.
- `Update @mapequation/infomap` listens for a `repository_dispatch` event from
  the `infomap` repository, pins the new package version, verifies the app, and
  opens a PR.

Required configuration for `infomap-online`:

- Secrets: `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `SSH_KNOWN_HOSTS`
- Optional secret: `SSH_PORT`
- Optional repository variable: `DEPLOY_BASE_URL`

Required configuration for `infomap`:

- Secret: `INFOMAP_ONLINE_REPO_DISPATCH_TOKEN`

## Authors

Daniel Edler, Anton Holmgren, Martin Rosvall
