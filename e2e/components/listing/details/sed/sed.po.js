class SedComponent {
  constructor() {
    this.elements = {
      sedHeader: '//div[text()="Safety Enhanced Design (SED)"]',
      ucdProcess: '#sed-ucd-processes-table',
      tasksTable: '#sed-tasks-table',
    };
  }

  get sedHeader() {
    return $(this.elements.sedHeader);
  }

  get ucdProcess() {
    return $(this.elements.ucdProcess);
  }

  get tasksTable() {
    return $(this.elements.tasksTable);
  }

  expandSed() {
    $('//div[text()="Safety Enhanced Design (SED)"]/following-sibling::div').scrollAndClick();
  }

  criteriaUcdCount() {
    return $('#sed-ucd-processes-table').$$('li').length;
  }

  testingTasksCount() {
    return $('#sed-tasks-table').$('tbody').$$('tr').length;
  }
}

export default SedComponent;
