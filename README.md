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
sudo npm install npm -g
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

The website is running at: [http://localhost:3000/](http://localhost:3000/)

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
