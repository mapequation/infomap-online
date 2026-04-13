# Infomap Online

Infomap Online is a client-side web application that makes it possible
for users to run [Infomap](//github.com/mapequation/infomap) without any
installation. Infomap runs locally on your computer and uploads no data
to any server. We support this solution by compiling Infomap from C++
to JavaScript with [Emscripten](//emscripten.org/),
which gives a performance penalty compared to the stand-alone version of Infomap.

The code for running Infomap as a web worker in the browser is available as a
[package on NPM](//www.npmjs.com/package/@mapequation/infomap).

## Development

This repository targets Node.js 20 and `npm`.

```bash
nvm use
npm ci
npm run dev
```

To run the same checks as CI locally:

```bash
npx playwright install chromium
npm run verify
```

## CI/CD

- `CI` runs on every push and pull request. It installs dependencies, runs `lint`,
  `typecheck`, builds the static export, and executes a browser smoke test against
  the exported site.
- `Deploy` runs after a successful `CI` run on `master` and deploys the tested
  `out/` artifact over SSH with `rsync --delete`.
- `Update @mapequation/infomap` listens for a `repository_dispatch` event from the
  `infomap` repository, pins the new package version, verifies the app, and opens a PR.

`infomap-online` repository configuration:

- Secrets: `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `SSH_KNOWN_HOSTS`
- Optional secret: `SSH_PORT`
- Optional repository variable: `DEPLOY_BASE_URL`

`infomap` repository configuration:

- Secret: `INFOMAP_ONLINE_REPO_DISPATCH_TOKEN`

## Authors

Daniel Edler, Anton Holmgren, Martin Rosvall
