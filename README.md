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
* `yarn start:dev`: Run a local dev server at: [http://localhost:3000/](http://localhost:3000/) with automatic reloading, but connecting to the DEV environment for data
* `yarn start:prod`: Run a local dev server at: [http://localhost:3000/](http://localhost:3000/) with automatic reloading, but using the production settings for js minification / packaging / etc.
* `yarn profile`: Generate a webpack statistics output file
* `yarn test`: Run the unit tests once
* `yarn test:auto`: Run the unit tests continuously, re-running the tests on any file change
* `yarn test:ahrq`: Run tests once in a fashion suitable for the deployment environment
* `yarn test:ci`: Run the tests once in a fashion suitable for a Continuous Integration environment
* `yarn e2e`: Run the end to end integration tests, as well as e2e linting
* `yarn e2e:lint`: Run code and syntax rules
* `yarn e2e:clean`: Clear out old E2E artifacts

#### Yarn environment parameters

Usable on `yarn build` and `yarn start`, these parameters control configuration of some properties

* `--env.NODE_ENV=production` or `--env.NODE_ENV=development` to indicate whether to build for development or production environments. Defaults to `development` if not provided
* `--env.style` to create a a style guide page at url/style.html. Defaults to "don't create" if not provided

#### Linting

On most Yarn commands the CSS Linter, JS Linter and HTML Linters will run. Webpack may fail to compile if any of the linters report issues, depending on the severity of the issue

#### E2E testing

By default, E2E tests will be executed against http://localhost:3000/. This URL can be configured at runtime with the parameter `baseUrl`. For example: `yarn e2e --baseUrl http://www.example.com/` would set all tests to run against www.example.com

If a single spec file should be tested, instead of all of them, the command `yarn e2e --spec path/to/file.spec.js` will exercise only that spec file

To run a suite of tests, execute `yarn e2e --suite suite-name`. For example, `yarn e2e --suite components` will execute only the tests on the components. See `wdio.conf.js` for a list of the suites

[git]: http://git-scm.com/
[nodejs]: https://nodejs.org/en/download/
[yarn]: https://yarnpkg.com/en/
[webpack]: https://webpack.js.org/

#### Automation credetials set up

Copy `e2e/config/credentialsEXAMPLE.js` to the file `e2e/config/credentials.js` and set the passwords for the users in the file to be valid users
