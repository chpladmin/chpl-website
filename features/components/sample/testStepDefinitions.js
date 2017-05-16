//features/step_definitions/test_step_definitions.js
var angularPage = require('./angularPage.js');
var {defineSupportCode} = require('cucumber');

defineSupportCode(({Given, When, Then}) => {
    Given(/^I go to "([^"]*)"$/, function (site) {
        angularPage.go(site);
    });

    When(/^I add "([^"]*)" in the task field$/, function (task) {
        angularPage.addTask(task);
    });

    When(/^I click the add button$/, function () {
        angularPage.submitTask();
    });

    Then(/^I should see my new task in the list$/, function () {
        var todoList = angularPage.angularHomepage.todoList;
        expect(todoList.count()).to.eventually.equal(3);
        return expect(todoList.get(2).getText()).to.eventually.equal('Be Awesome');
    });
});
