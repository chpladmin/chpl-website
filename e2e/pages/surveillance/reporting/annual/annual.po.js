class AnnualPage {
  constructor() {
    this.elements = {
      obstacle: '#obstacle',
      priority: '#priority',
      download: '//*[contains(@id,"surveillance-report-download")]',
    };
  }

  get obstacleSummary() {
    return $(this.elements.obstacle);
  }

  get prioritySummary() {
    return $(this.elements.priority);
  }

  get download() {
    return $(this.elements.download);
  }
}

export default AnnualPage;
