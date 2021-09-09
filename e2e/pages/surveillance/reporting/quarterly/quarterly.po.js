class QuarterlyPage {
  constructor() {
    this.elements = {
      surveillanceActivity: '#surveillance-activities',
      reactiveSurveillance: '#reactive-surveillance-summary',
      prioritizedElement: '#prioritized-element',
      disclosureSummary: '#disclosure-requirements-summary',
      relevantListingsHeader: '#relevant-listings-header',
      surveillanceRoot: 'chpl-surveillance-report-relevant-listings',
      complaintsRoot: 'chpl-complaints-bridge',
      complaintsHeader: '#complaints-header',
      download: '//*[contains(@id,"surveillance-report-download")]',

    };
  }

  get surveillanceActivity() {
    return $(this.elements.surveillanceActivity);
  }

  get reactiveSurveillance() {
    return $(this.elements.reactiveSurveillance);
  }

  get prioritizedElement() {
    return $(this.elements.prioritizedElement);
  }

  get disclosureSummary() {
    return $(this.elements.disclosureSummary);
  }

  get relevantListingsHeader() {
    return $(this.elements.relevantListingsHeader);
  }

  get complaintsHeader() {
    return $(this.elements.complaintsHeader);
  }

  get surveillanceTableRows() {
    return $(this.elements.surveillanceRoot).$('table').$('tbody').$$('tr').length;
  }

  get complaintsTableRows() {
    return $(this.elements.complaintsRoot).$('table').$('tbody').$$('tr').length;
  }

  get download() {
    return $(this.elements.download);
  }
}

export default QuarterlyPage;
