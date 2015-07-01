# chpl-website

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

The website is running at: `http://localhost:8000/app/index.html`.

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

[git]: http://git-scm.com/
