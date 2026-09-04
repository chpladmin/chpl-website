# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Web UI for CHPL (Certified Health IT Product List), a healthit.gov site. AngularJS 1.8 shell (routing only) with all page/feature UI built in React. Yarn 2+ (`packageManager: yarn@4.18.0`) is required — run `corepack enable` if `yarn` isn't already the right version.

## Commands

```
yarn install                        # install deps
yarn start                          # dev server at localhost:3000, proxies /rest to local backend at localhost:8181/chpl-service
yarn start:dev                      # same, but proxies /rest to https://chpl-dev.healthit.gov/rest
yarn start:prod                     # dev server with production JS minification/packaging
yarn start:prod:dev                 # production build settings + DEV environment data
yarn build                          # production webpack build to dist/
yarn lint                           # eslint against src
yarn lint:fix                       # eslint --fix; pass a path to fix a single file, e.g. yarn lint:fix src/app/path/to/file.jsx
```

There is no test runner wired up currently (no `test` script, no jest/karma config in the repo despite some test-related devDependencies) — don't assume `yarn test` exists.

Local backend proxy target defaults to `http://localhost:8181/chpl-service`; requests to `/rest/*` are rewritten and proxied there (or to the DEV env with `--env.useDev`).

## Architecture

**AngularJS is a thin shell over a React app.** `src/app/index.js` bootstraps a single `angular.module('chpl', ...)` and wires up `ui.router` states, but essentially every feature is a React component tree that gets embedded into Angular via a bridge — do not add new AngularJS controllers/directives/templates; extend the React side instead.

### Angular → React bridge

`src/app/services/angular-react-helper.jsx` exports `reactToAngularComponent(Component)`, which wraps a React component as an Angular component definition (bindings derived from `Component.propTypes`, mounted/unmounted via `react-dom/client` `createRoot`). Each feature area's `*.module.js` registers these bridges, e.g. `src/app/pages/search/search.module.js` does:

```js
.component('chplSvapSearchWrapperBridge', reactToAngularComponent(ChplSvapSearchWrapper))
```

and the corresponding `*.state.js` (e.g. `search.state.js`) maps a `ui-router` state/URL to that Angular component name. So routing lives in Angular (`$stateProvider`), everything else is React.

### Per-page React file trio

Most pages/features under `src/app/pages/**` and `src/app/components/**` follow a three-file pattern:
- `x-wrapper.jsx` — wraps the page in `AppWrapper` (global providers) for use as an Angular bridge target.
- `x.jsx` — the container: fetches data via react-query hooks from `api/*`, holds local state/context, has no markup logic of its own.
- `x-view.jsx` — presentational component, receives data/handlers as props.

### Provider stack

`src/app/app-wrapper.jsx` composes the global provider tree every page mounts into (Redux `Provider` → MUI `ThemeProvider` → Snackbar → `ApiWrapper` (axios + react-query) → `UserWrapper` → `FlagWrapper` (feature flags) → `CompareWrapper` → `CmsWrapper` → `BrowserWrapper` → analytics/hash contexts → cookies → `ChplAppLayout`). When adding a new cross-cutting concern, it likely belongs as another layer here rather than threaded through props.

- **Redux** (`@reduxjs/toolkit`, `src/app/store.js`): only two slices exist — `browserInfo` and `userInfo` — persisted to `localStorage` under key `chplState` via custom middleware. Most other shared state uses React Context instead of Redux; check `src/app/shared/contexts/` before adding a new Redux slice.
- **Data fetching**: `@tanstack/react-query`, with hooks defined per-domain in `src/app/api/*.jsx` (e.g. `useFetchAcbs`, `useFetchCriteria`). `src/app/api/api-wrapper.jsx` sets up the shared `QueryClient` and axios provider; devtools show automatically in dev mode.
- **Contexts**: `src/app/shared/contexts/` holds domain contexts (analytics, browser, compare, developer, flags, hash, listing, pending-listing, user, etc.) re-exported from `contexts/index.js`.
- **Shared PropTypes shapes**: `src/app/shared/prop-types/` — reuse these shapes for domain objects (listing, developer, acb, criterion, ...) instead of redefining inline.

### Module resolution

Webpack's `resolve.modules` includes `src/app`, so imports write as if `src/app` were a root, e.g. `import ApiWrapper from 'api/api-wrapper'`, `import { AnalyticsContext } from 'shared/contexts'`, `import AppWrapper from 'app-wrapper'`. Don't use relative `../../..` paths across top-level directories (`api/`, `components/`, `pages/`, `services/`, `shared/`, `themes/`) — use the bare-style import instead, matching existing files. ESLint's `import/resolver` is configured the same way (`moduleDirectory: ["src/app", "node_modules"]`).

### Multiple webpack entry points

`webpack.config.js` defines separate entry bundles for `app`, `administration`, `charts`, `compare`, `listing`, `organizations`, `registration`, `reports`, `search`, `subscriptions`, and `templates`. If you add a new top-level page area intended to be its own bundle, add an entry here.

### Build-time globals

`webpack.DefinePlugin` injects `DEVELOPER_MODE`, `ENABLE_LOGGING`, `MINUTES_UNTIL_IDLE`, `MINUTES_UNTIL_LOGOUT` based on `NODE_ENV`. Reference these as bare globals (with `/* global DEVELOPER_MODE */` eslint comment) rather than `process.env`.

### Deployment

`Dockerfile` is a two-stage build: `yarn build` output (`dist/`) is served by Apache (`httpd:2.4-alpine`) on port 3000, with `apache-config/proxy.conf` handling API proxying in the container.

## Linting

ESLint config (`.eslintrc`) extends `airbnb` + React/React Hooks recommended rules, uses `babel-eslint` parser. `.eslintignore` excludes generated/legacy files (`cap*.js`, `certid*.js`, `swagger*.js`, `index.constants.js`, `lib/*`, `*.mock.js`). Notable non-default rules: `max-len` is off, `import/order` requires newlines between groups, `react/require-default-props` is off. Webpack itself runs eslint and can fail the build on lint errors depending on severity.

### Import order in .jsx files

Group imports into three blocks, separated by a blank line, in this order:
1. External packages (`react`, `react-redux`, `axios-jwt`, `@material-ui/core`, ...).
2. Relative imports (`./`, `../`) — there aren't many of these; they're typically co-located files or a subfolder of the importing file.
3. Bare imports resolved from `src/app` as root (e.g. `api/acbs`, `components/util`, `shared/contexts`, `services/analytics.service`), alphabetized by path, e.g. `api/acbs` before `components/util` before `shared/contexts`.

Within any named (non-default) import, alphabetize the imported names, e.g. `import { setLoginState, setUser } from 'components/login/userInfo.slice';` (not `{ setUser, setLoginState }`).
