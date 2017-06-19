//features/components/admin/admin.steps.js
var page = require('./admin.page.js');
var {defineSupportCode} = require('cucumber');

defineSupportCode(({Given, When, Then}) => {

    Given('I am on the Administration page', function () {
        return page.go();
    });
});
