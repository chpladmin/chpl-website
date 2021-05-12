const elements = {
  sedHeader: '//div[text()="Safety Enhanced Design (SED)"]',
  ucdProcess: '#sed-ucd-processes-table',
  tasksTable: '#sed-tasks-table',
};

class SedComponent {
  constructor () { }

  get sedHeader () {
    return $(elements.sedHeader);
  }

  get ucdProcess () {
    return $(elements.ucdProcess);
  }

  get tasksTable () {
    return $(elements.tasksTable);
  }

  expandSed () {
    $('//div[text()="Safety Enhanced Design (SED)"]/following-sibling::div').scrollAndClick();
  }

  criteriaUcdCount () {
    return $('#sed-ucd-processes-table').$$('li').length;
  }

  testingTasksCount () {
    return $('#sed-tasks-table').$('tbody').$$('tr').length;
  }

}

export default SedComponent;
