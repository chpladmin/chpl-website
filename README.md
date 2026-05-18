# chpl-website

The web UI for chpl

## Prerequisites

Git, Node.js, and Yarn are required to install and run this project.

 * Git: [git][git]
 * Node.js: [nodejs][nodejs]
 * Yarn: [yarn][yarn]

## Getting Started

Clone the repository using [git][git]:

### Install Node.js

See installation instructions here: [nodejs][nodejs] but be aware that the required version of Node is 14.x

### Install yarn

The project uses Yarn 2+. Installation instructions for Yarn 2+ are not easily found, but some information can be found at: [yarn 1][yarn] and [yarn 2+][yarn2]. The basic steps are to install yarn 1 globally, then run `yarn install` in the project directory. Yarn 1 can be installed globally with npm: `npm install -g yarn`

### Install dependencies

```
yarn install
```

### Yarn scripts

* `yarn build`: Build deployable artifacts
* `yarn start`: Run a local dev server at: [http://localhost:3000/](http://localhost:3000/) with automatic reloading
* `yarn start:dev`: Run a local dev server at: [http://localhost:3000/](http://localhost:3000/) with automatic reloading, but connecting to the DEV environment for data
* `yarn start:prod`: Run a local dev server at: [http://localhost:3000/](http://localhost:3000/) with automatic reloading, but using the production settings for js minification / packaging / etc.
* `yarn start:prod:dev`: Run a local dev server at: [http://localhost:3000/](http://localhost:3000/) with automatic reloading, but using the production settings for js minification / packaging / etc. and connecting to the DEV environment for data
* `lint`: Run ESLint against all JavaScript files in the project
* `lint:fix`: Run ESLint against all JavaScript files in the project and fix any errors that ESLint can fix automatically. Especially useful when run as `yarn lint:fix src/app/path/to/file.js[x]` to automatically apply fixes against a single file

#### Yarn environment parameters

Usable on `yarn build` and `yarn start`, these parameters control configuration of some properties

* `--env.NODE_ENV=production` or `--env.NODE_ENV=development` to indicate whether to build for development or production environments. Defaults to `development` if not provided

#### Linting

On most Yarn commands the CSS Linter, JS Linter and HTML Linters will run. Webpack may fail to compile if any of the linters report issues, depending on the severity of the issue.

[git]: http://git-scm.com/
[nodejs]: https://nodejs.org/en/download/
[yarn]: https://yarnpkg.com/en/
[yarn2]: https://yarnpkg.com/getting-started/migration
