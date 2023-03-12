class SystemJobsComponent {
  constructor() {
    this.elements = {
      systemjobsTable: 'table[aria-label="Types of Jobs table"]',
      scheduledsystemjobsTable: 'table[aria-label="Scheduled System Jobs table"]',
    };
  }

  async getSystemJobsTableHeaders() {
    return (await
            (await
             $(this.elements.systemjobsTable)
            ).$('thead')
           ).$$('th');
  }

  getAvailableJobs() {
    return $(this.elements.systemjobsTable)
      .$('tbody')
      .$$('tr')
      .map((row) => row.$$('td')[0].getText());
  }
}

export default SystemJobsComponent;
