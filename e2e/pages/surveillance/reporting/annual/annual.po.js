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

  get prioritySummary() {
    return $(this.elements.priority);
  }

  get download() {
    return $(this.elements.download);
  }

  set(fields) {
    $(this.elements.obstacle).setValue(fields.obstacle);
    $(this.elements.priority).setValue(fields.priority);
  }
}

export default AnnualPage;
