class AnnualPage {
  constructor() {
    this.elements = {
      obstacle: '#obstacle',
      priority: '#priority',
      download: '#surveillance-report-download',
    };
  }

  get obstacleSummary() {
    return $(this.elements.obstacle);
  }

  async obstacleSummaryfield() {
    return $(this.elements.obstacle);
  }

  get prioritySummary() {
    return $(this.elements.priority);
  }

  get download() {
    return $(this.elements.download);
  }

  async set(fields) {
    await $(this.elements.obstacle).setValue(fields.obstacle);
    await $(this.elements.priority).setValue(fields.priority);
  }
}

export default AnnualPage;
