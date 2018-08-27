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

```
TBD
```

### Install dependencies

```
yarn install
```

### Run the Application

```
yarn start
OR
yarn build (to build deployable files
```

The website will be running at: [http://localhost:3000/](http://localhost:3000/)

**OBE?** Alternatively, update npm to at least version 4.0.5 and try running `npm install` again. See https://stackoverflow.com/questions/6237295/how-can-i-update-node-js-and-npm-to-the-next-versions for instructions on updating npm

## Testing

### Unit testing

This will start a service that watches the files under test, and when any of them are changed, immediately re-run the tests, quickly showing all results.

```
yarn test:auto
```

[git]: http://git-scm.com/
[nodejs]: https://nodejs.org/en/download/
[yarn]: https://yarnpkg.com/en/
[webpack]: https://webpack.js.org/
