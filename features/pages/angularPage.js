'use strict';
module.exports = {
    // page definition
    angularHomepage: {
        taskButton: element(by.css('[value="add"]')),
        taskList: element(by.model('todoList.todoText')),
        todoList: element.all(by.repeater('todo in todoList.todos'))
    },

    //page methods
    go: function (site) {
        browser.get(site);
    },

    addTask: function (task) {
        this.angularHomepage.taskList.sendKeys(task);
    },

    submitTask: function () {
        this.angularHomepage.taskButton.click();
    }
};
