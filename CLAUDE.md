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

`src/app/app-wrapper.jsx` composes the global provider tree every page mounts into (Redux `Provider` → `CookiesProvider` → MUI `ThemeProvider` → Snackbar → `ApiWrapper` (axios + react-query) → `UserWrapper` → `FlagWrapper` (feature flags) → `CompareWrapper` → `CmsWrapper` → analytics/hash contexts → `ChplAppLayout`). When adding a new cross-cutting concern, it likely belongs as another layer here rather than threaded through props.

- **Redux** (`@reduxjs/toolkit`, `src/app/store.js`): only two slices exist — `browserInfo` and `userInfo` — persisted to `localStorage` under key `chplState` via custom middleware. Most other shared state uses React Context instead of Redux; check `src/app/shared/contexts/` before adding a new Redux slice.
- **Data fetching**: `@tanstack/react-query`, with hooks defined per-domain in `src/app/api/*.jsx` (e.g. `useFetchAcbs`, `useFetchCriteria`). `src/app/api/api-wrapper.jsx` sets up the shared `QueryClient` and axios provider; devtools show automatically in dev mode.
- **Contexts**: `src/app/shared/contexts/` holds domain contexts (analytics, compare, developer, flags, hash, listing, pending-listing, user, etc.) re-exported from `contexts/index.js`.
- **Shared PropTypes shapes**: `src/app/shared/prop-types/` — reuse these shapes for domain objects (listing, developer, acb, criterion, ...) instead of redefining inline.

### Module resolution

Webpack's `resolve.modules` includes `src/app`, so imports write as if `src/app` were a root, e.g. `import ApiWrapper from 'api/api-wrapper'`, `import { AnalyticsContext } from 'shared/contexts'`, `import AppWrapper from 'app-wrapper'`. Don't use relative `../../..` paths across top-level directories (`api/`, `components/`, `pages/`, `services/`, `shared/`, `themes/`) — use the bare-style import instead, matching existing files. ESLint's `import/resolver` is configured the same way (`moduleDirectory: ["src/app", "node_modules"]`).

### Multiple webpack entry points

`webpack.config.js` defines separate entry bundles for `app`, `administration`, `charts`, `compare`, `listing`, `organizations`, `registration`, `reports`, `search`, `subscriptions`, and `templates`. If you add a new top-level page area intended to be its own bundle, add an entry here.

### Build-time globals

`webpack.DefinePlugin` injects `DEVELOPER_MODE` and `ENABLE_LOGGING` based on `NODE_ENV`. Reference these as bare globals (with `/* global DEVELOPER_MODE */` eslint comment) rather than `process.env`.

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

## Commits

Every commit message must contain its branch name as a tag — `[#OCD-1234]` for branch `OCD-1234` — **exactly once**. This is a regulatory and policy requirement: a missing tag is a defect, and so is a second copy. `release:` commits are the one exemption; they are version deploys rather than ticket work.

Almost every commit is a single subject line plus the tag and nothing else. That is the house style — it describes over 95% of the history — so write that unless you have a reason not to:

```
fix: bail out of downloads when the session cannot be renewed

[#OCD-1234]
```

Add a body only when the reason for the change is not evident from the subject. When you do, the tag goes on its own line at the end of the body, before any git trailers (`Co-Authored-By:`, `Signed-off-by:`), since tooling only recognises trailers as the final block of a message.

### Subject prefixes

- `feat`, `fix`, `refactor`, `ui` — the bulk of the work. `ui` is for presentation-only changes.
- `<type>-flag` (`feat-flag`, `ui-flag`, `fix-flag`) — work behind a feature flag. Note the order: a lone `flag-feat` exists in the history and is not the pattern to copy.
- `build`, `ci`, `style`, `perf`, `chore` — tooling, formatting and housekeeping.
- `release` — version deploys. Exempt from the tag requirement, as above.
- `wip` — appears in the history but says nothing useful; avoid it.

Lowercase the text after the prefix. Append `!` — `feat!:`, `ui!:`, `fix-flag!:` — when the change is user-visible and should be picked up for release notes. It does not carry the conventional-commits "breaking change" meaning here.

### Which mechanism supplies the tag

Three things can put the tag there, and only one should:

1. **A `prepare-commit-msg` hook**, which inserts `[#<branch>]` immediately after the subject line rather than at the end of the body.
2. **These instructions**, when the message is drafted by an agent reading this file.
3. **Typing it**, when writing the message by hand.

Know which one is live in your clone before you rely on it. If the hook fires *and* the message already carries a tag, the commit ends up with two; if it does not fire and nobody wrote one, the commit ends up with none. Check with:

```
git hook run prepare-commit-msg -- <throwaway file containing a test message>
```

If a tag appears, the hook owns it — leave it out of the message you write. If nothing appears, you own it.

Do not assume the hook is the one doing it. It has three known gaps:

- **It may not run at all.** The hooks have shipped as MSYS-style symlinks in `.git/hooks` pointing into a sibling `chpl-documentation` checkout. Git Bash follows those, but native `git.exe` cannot execute through them, so on Windows they fail with `cannot spawn .git/hooks/pre-commit: No such file or directory` — or silently never fire. The fix is a directory of real (non-symlink) hook files plus `git config core.hooksPath <dir>`; a relative path there resolves from the repo root, so it works from any subdirectory.
- **It never runs for commits made outside a local clone.** Anything committed through the GitHub web UI — an inline file edit, a suggested-change accepted on a PR — bypasses local hooks entirely, so the tag has to be typed. There are untagged commits in the history from exactly this route.
- **It skips some commits by design.** It bails on any message containing the word "merge" (case-insensitive, anywhere in the message, not just the subject) and on any branch whose name contains "rebas".
