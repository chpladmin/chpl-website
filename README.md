# chpl-website

[![Build Status](http://54.213.57.151:9090/job/andlar_chpl-website/badge/icon)](http://54.213.57.151:9090/job/andlar_chpl-website)
[![Test Coverage](https://codeclimate.com/github/andlar/chpl-website/badges/coverage.svg)](https://codeclimate.com/github/andlar/chpl-website/coverage)
[![Code Climate](https://codeclimate.com/github/andlar/chpl-website/badges/gpa.svg)](https://codeclimate.com/github/andlar/chpl-website)

The web UI for chpl

## Prerequisites

Git, Node.js, npm, and gulp are required to install and test this project.

 * Git: [git][git]
 * Node.js: [nodejs][nodejs]
 * NPM: [npm][npm]
 * Gulp: [gulp][gulp]

## Getting Started

Clone the repository using [git][git]:

### Install Node.js

See installation instructions here: [nodejs][nodejs]

### Install npm & gulp

```
npm install -g npm
npm install gulp
npm install bower
npm install
bower install
```

### Run the Application

```
gulp serve
OR
gulp seve:dist //to serve distribution ready files (minified, uglified, etc.)
```

The website will be running at: [http://localhost:3000/](http://localhost:3000/)

If you run into errors that say something like `gulp-concat` was not found, it's likely you're hitting an issue where npm didn't install all of the dependencies of the projects in `packages.json`. That can be checked by looking in `node_modules/`. There should be ~900 directories there; if there are closer to 50, then that's the issue. Try running `npm install gulp-concat`, and `gulp serve` again. It should give you the next package that's missing. Repeat.

Alternatively, update npm to at least version 4.0.5 and try running `npm install` again. See https://stackoverflow.com/questions/6237295/how-can-i-update-node-js-and-npm-to-the-next-versions for instructions on updating npm

## Testing

### Unit testing

This will start a service that watches the files under test, and when any of them are changed, immediately re-run the tests, quickly showing all results.

```
gulp test:auto
```

### End to end testing

```
gulp e2e
```

## Simplify development

Run the server and the tests at the same time, where the system watches changes to files and automatically updates the browser and re-runs all of the tests on any change

```
gulp live
```

[git]: http://git-scm.com/
[nodejs]: https://nodejs.org/en/download/
[npm]: https://www.npmjs.com/
[gulp]: http://gulpjs.com/
