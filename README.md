# chpl-website

[![Build Status](http://54.213.57.151:9090/job/andlar_chpl-website/badge/icon)](http://54.213.57.151:9090/job/andlar_chpl-website)
[![Test Coverage](https://codeclimate.com/github/andlar/chpl-website/badges/coverage.svg)](https://codeclimate.com/github/andlar/chpl-website/coverage)
[![Code Climate](https://codeclimate.com/github/andlar/chpl-website/badges/gpa.svg)](https://codeclimate.com/github/andlar/chpl-website)

The web UI for chpl

## Prerequisites

Git, Node.js, npm, and gulp are required to install and test this project.

 * Git: [git][git]
 * Node.js: [nodejs][nodejs]
 * Yarn: [yarn][yarn]
 * Webpack: [webpack][webpack]

## Getting Started

Clone the repository using [git][git]:

### Install Node.js

See installation instructions here: [nodejs][nodejs]

### Install yarn and webpack

Yarn: [yarn][yarn]

### Install dependencies

```
yarn install
```

### Yarn scripts

* `yarn build`: Build deployable artifacts
* `yarn html`: Run HTML Linter with rules that should all pass
* `yarn html-lint:verbose`: Run HTML Linter with rules that don't play well with AngularJS, so some errors are expected, but this can find some errors that need to be fixed
* `yarn start`: Run a local dev server at: [http://localhost:3000/](http://localhost:3000/) with automatic reloading
* `yarn profile`: Generate a webpack statistics output file
* `yarn test`: Run the unit tests once
* `yarn test:auto`: Run the unit tests continuously, re-running the tests on any file change
* `yarn test:ahrq`: Run tests once in a fashion suitable for the deployment environment
* `yarn test:ci`: Run the tests once in a fashion suitable for a Continuous Integration environment

#### Yarn environment parameters

Usable on `yarn build` and `yarn start`, these parameters control configuration of some properties

* `--env.NODE_ENV=production` or `--env.NODE_ENV=development` to indicate whether to build for development or production environments. Defaults to `development` if not provided
* `--env.flags=production` or `--env.flags=development` to indicate what set of feature flags to use. Defaults to `development` if not provided

#### Linting

On all Yarn commands the CSS Linter, JS Linter and HTML Linters will run. Webpack may fail to compile if any of the linters report issues, depending on the severity of the issue

[git]: http://git-scm.com/
[nodejs]: https://nodejs.org/en/download/
[yarn]: https://yarnpkg.com/en/
[webpack]: https://webpack.js.org/
