class ScheduledPage {
  constructor() {
    this.elements = {
      availableJobTable: 'table[aria-label="Types of Reports table"]',
      button: (name) => `button[aria-label="Schedule Report ${name}"]`,
      availableAcbs: 'div[aria-label="ONC-ACBs available to schedule"]',
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
    const items = list.$$('div');
    const acbs = items.map((acb) => acb.$('label').getText());
    return acbs;
  }
}

export default ScheduledPage;
