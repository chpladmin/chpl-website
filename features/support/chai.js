// support/chai.js
// http://chaijs.com/api/bdd/
// https://github.com/domenic/chai-as-promised

'use strict';

let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

//global.assert = chai.assert;
global.expect = chai.expect;
//global.should = chai.should;
