// support/chai.js

'use strict';

let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

global.expect = chai.expect;
global.assert = chai.assert;
