# chpl-website

[![Build Status](http://54.213.57.151:9090/job/andlar_chpl-website/badge/icon)](http://54.213.57.151:9090/job/andlar_chpl-website)
[![Test Coverage](https://codeclimate.com/github/andlar/chpl-website/badges/coverage.svg)](https://codeclimate.com/github/andlar/chpl-website/coverage)
[![Code Climate](https://codeclimate.com/github/andlar/chpl-website/badges/gpa.svg)](https://codeclimate.com/github/andlar/chpl-website)

The web UI for chpl

## Prerequisites

Git, Node.js, Yarn, and Webpack are required to install and test this project.

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
* `yarn html-lint`: Run HTML Linter with rules that should all pass
* `yarn html-lint:verbose`: Run HTML Linter with rules that don't play well with AngularJS, so some errors are expected, but this can find some errors that need to be fixed
* `yarn start`: Run a local dev server at: [http://localhost:3000/](http://localhost:3000/) with automatic reloading
* `yarn start:dev`: Run a local dev server at: [http://localhost:3000/](http://localhost:3000/) with automatic reloading, but connecting to the DEV environment for data
* `yarn start:prod`: Run a local dev server at: [http://localhost:3000/](http://localhost:3000/) with automatic reloading, but using the production settings for js minification / packaging / etc.
* `yarn profile`: Generate a webpack statistics output file
* `yarn test`: Run the Jest-based unit tests once (tests based on the React components)
* `yarn test:auto`: Run the Jest-based unit tests continuously (tests based on the React components), re-running the tests on any file change
* `lint`: Run ESLint against all JavaScript files in the project
* `lint:fix`: Run ESLint against all JavaScript files in the project and fix any errors that ESLint can fix automatically. Especially useful when run as `yarn lint:fix src/app/path/to/file.js[x]` to automatically apply fixes against a single file
* `yarn e2e`: Run the end to end integration tests, as well as e2e linting
* `yarn e2e:lint`: Run code and syntax rules
* `yarn e2e:clean`: Clear out old E2E artifacts

#### Yarn environment parameters

Usable on `yarn build` and `yarn start`, these parameters control configuration of some properties

* `--env.NODE_ENV=production` or `--env.NODE_ENV=development` to indicate whether to build for development or production environments. Defaults to `development` if not provided
* `--env.style` to create a a style guide page at url/style.html. Defaults to "don't create" if not provided

#### Linting

On most Yarn commands the CSS Linter, JS Linter and HTML Linters will run. Webpack may fail to compile if any of the linters report issues, depending on the severity of the issue.

#### E2E (AQA) Testing

##### E2E (AQA) Credentials

Copy `e2e/config/credentialsEXAMPLE.js` to the file `e2e/config/credentials.js` and set the passwords for the users in the file to be valid users

#### E2E (AQA) Running Tests
By default, E2E tests will be executed against http://localhost:3000/.

The tests can be also be executed using different environments. The other URLs for other environments need to be configured in `e2e/config/urls.js` file and URLs must have the correct format. There is a `e2e/config/urlsEXAMPLE.js` that describes the necessary entries and formatting.

Copy `e2e/config/urlsEXAMPLE.js` to the file `e2e/config/urls.js` and set the urls for each environments in the file

To specify the environment to run the tests against, pass ENV variable with 'dev', 'qa' ,'stage' options. For example:
* `ENV=dev yarn e2e`
* `ENV=qa yarn e2e`
* `ENV=stage yarn e2e`

If a single spec file should be tested, instead of all of them:
* `yarn e2e --spec path/to/file.spec.js`

To change the loglevel:
* `yarn e2e --l info`

To run a suite of tests:
* `yarn e2e --suite suite-name`.

For example, `yarn e2e --suite components` will execute only the tests on the components. See `wdio.conf.js` for a list of the suites

When debugging, taking screenshots can be useful. The command `browser.saveScreenshot('path/to/file.png')` will save a screenshot to a location relative to the project root

[git]: http://git-scm.com/
[nodejs]: https://nodejs.org/en/download/
[yarn]: https://yarnpkg.com/en/
[webpack]: https://webpack.js.org/
