class ScheduledPage {
  constructor() {
    this.elements = {
      availableJobTable: 'table[aria-label="Types of Jobs table"',
    };
  }

  getAvailableJobs() {
    return $(this.elements.availableJobTable)
      .$('tbody')
      .$$('tr')
      .map((row) => row.$$('td')[0].getText());
  }
}

export default ScheduledPage;
