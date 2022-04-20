class ScheduledPage {
  constructor() {
    this.elements = {
      availableJobTable: 'table[aria-label="Types of Jobs table"]',
      button: (name) => `button[aria-label="Schedule Job ${name}"]`,
      availableAcbs: 'ul[aria-label="ONC-ACBs available to schedule"]',
    };
  }

  getAvailableJobs() {
    return $(this.elements.availableJobTable)
      .$('tbody')
      .$$('tr')
      .map((row) => row.$$('td')[0].getText());
  }

  startSchedulingAJob(name) {
    $(this.elements.button(name)).click();
  }

  getAvailableAcbs() {
    const list = $(this.elements.availableAcbs);
    const items = list.$$('li');
    const acbs = items.map((acb) => acb.getText());
    return acbs;
  }
}

export default ScheduledPage;
