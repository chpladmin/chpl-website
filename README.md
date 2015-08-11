# chpl-website

[![Build Status](http://54.213.57.151:9090/job/andlar_chpl-website/badge/icon)](http://54.213.57.151:9090/job/andlar_chpl-website)
[![Test Coverage](https://codeclimate.com/github/andlar/chpl-website/badges/coverage.svg)](https://codeclimate.com/github/andlar/chpl-website/coverage)
[![Code Climate](https://codeclimate.com/github/andlar/chpl-website/badges/gpa.svg)](https://codeclimate.com/github/andlar/chpl-website)

The web UI for chpl

## Prerequisites

Git and node.js are required to install and test this project.

 * Git: [http://git-scm.com/](http://git-scm.com/)
 * Node.js: [http://nodejs.org/](http://nodejs.org/)

## Getting Started

Clone the repository using [git][git]:

### Install Dependencies

```
npm install
```

### Run the Application

```
npm start
```

The website is running at: [http://localhost:8000/app/](http://localhost:8000/app/)

## Testing

### Unit testing

This will start a service that watches the files under test, and when any of them are changed, immediately re-run the tests, quickly showing all results.

```
npm test
```

### End to end testing

Set it up first by installing the webdriver.

```
npm run update-webdriver
```

To do end to end testing, first start the node server, then run the tests

```
npm start &
npm run protractor
```

# Production deployment

Edit chpl-website/app/common/commonModule.js and set the API url to be the location of the tomcat server running the CHPL API

[git]: http://git-scm.com/
