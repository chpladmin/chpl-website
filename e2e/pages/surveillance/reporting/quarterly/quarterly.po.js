class QuarterlyPage {
  constructor() {
    this.elements = {
      header: 'chpl-surveillance-reporting h2',
      breadcrumbs: '.breadcrumb li',
      surveillanceActivity: '#surveillance-activities',
      reactiveSurveillance: '#reactive-surveillance-summary',
      prioritizedElement: '#prioritized-element',
      disclosureSummary: '#disclosure-requirements-summary',
      relevantListingsHeader: '#relevant-listings-header',
      surveillanceRoot: 'chpl-surveillance-report-relevant-listings',
      complaintsRoot: 'chpl-complaints-wrapper-bridge',
      complaintsHeader: '#complaints-header',
      download: '#surveillance-report-download',
      outcome: '#surveillance-outcome',
      processType: '#surveillance-process-type',
      grounds: '#grounds-for-initiating',
      nonCoformityCause: '#nonconformity-causes',
      nonConformityNature: '#nonconformity-nature',
      stepsSurveil: '#steps-to-surveil',
      stepsEngage: '#steps-to-engage',
      cost: '#additional-costs-evaluation',
      limitationsEvaluation: '#limitations-evaluation',
      nondisclosureEvaluation: '#nondisclosure-evaluation',
      directionDeveloperResolution: '#direction-developer-resolution',
      verificationCap: '#completed-cap-verification',
      surveillanceData: '#save-surveillance-data',
      progressBar: '.progress-bar',
      editSurveillanceData: '//*[starts-with(@id,"edit-surveillance-data-")]',
      viewSurveillanceData: (listingId) => `//button[@id="view-listing-data-${listingId}"]`,
    };
  }

  async waitForQuarterToBeFullyLoaded(title) {
    browser.waitUntil(async () => (await (await $$(this.elements.breadcrumbs)).getText()).includes(title));
    browser.waitUntil(async () => (await this.getSurveillanceTableRows()) >= 1);
    browser.waitUntil(async () => (await this.getComplaintsTableRows()) >= 1);
  }

  async set(fields) {
    await (await $(this.elements.surveillanceActivity)).setValue(fields.surveillanceActivity);
    await (await $(this.elements.reactiveSurveillance)).setValue(fields.reactiveSurveillance);
    await (await $(this.elements.prioritizedElement)).setValue(fields.prioritizedElement);
    await (await $(this.elements.disclosureSummary)).setValue(fields.disclosureSummary);
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

  async getSurveillanceTableRows() {
    return (await (await (await (await $(this.elements.surveillanceRoot)).$('table')).$('tbody')).$$('tr')).length;
  }

  async getComplaintsTableRows() {
    return (await (await (await (await $(this.elements.complaintsRoot)).$('table')).$('tbody')).$$('tr')).length;
  }

  get download() {
    return $(this.elements.download);
  }

  get outcome() {
    return $(this.elements.outcome);
  }

  get processType() {
    return $(this.elements.processType);
  }

  get grounds() {
    return $(this.elements.grounds);
  }

  get nonCoformityCause() {
    return $(this.elements.nonCoformityCause);
  }

  get nonConformityNature() {
    return $(this.elements.nonConformityNature);
  }

  get stepsSurveil() {
    return $(this.elements.stepsSurveil);
  }

  get stepsEngage() {
    return $(this.elements.stepsEngage);
  }

  get cost() {
    return $(this.elements.cost);
  }

  get limitationsEvaluation() {
    return $(this.elements.limitationsEvaluation);
  }

  get nondisclosureEvaluation() {
    return $(this.elements.nondisclosureEvaluation);
  }

  get directionDeveloperResolution() {
    return $(this.elements.directionDeveloperResolution);
  }

  get verificationCap() {
    return $(this.elements.verificationCap);
  }

  async saveSurveillanceData() {
    await (await $(this.elements.surveillanceData)).click();
  }

  get surveillanceData() {
    return $(this.elements.surveillanceData);
  }

  get progressBar() {
    return $(this.elements.progressBar);
  }

  async getListingId(row, col) {
    return (await (await $(this.elements.surveillanceRoot)).$(`//tbody/tr[${row}]/td[${col}]`)).getText();
  }

  async editSurveillanceData() {
    await (await $(this.elements.editSurveillanceData)).click();
  }

  async viewSurveillanceData(listingId) {
    await (await $(this.elements.viewSurveillanceData(listingId))).click();
  }

  async setSurvData(fields) {
    await (await $(this.elements.outcome)).selectByAttribute('value', fields.outcome);
    await (await $(this.elements.processType)).selectByAttribute('value', fields.processType);
    await (await $(this.elements.grounds)).setValue(fields.grounds);
    await (await $(this.elements.nonCoformityCause)).setValue(fields.nonCoformityCause);
    await (await $(this.elements.nonConformityNature)).setValue(fields.nonConformityNature);
    await (await $(this.elements.stepsSurveil)).setValue(fields.stepsSurveil);
    await (await $(this.elements.stepsEngage)).setValue(fields.stepsEngage);
    await (await $(this.elements.cost)).setValue(fields.cost);
    await (await $(this.elements.limitationsEvaluation)).setValue(fields.limitationsEvaluation);
    await (await $(this.elements.nondisclosureEvaluation)).setValue(fields.nondisclosureEvaluation);
    await (await $(this.elements.directionDeveloperResolution)).setValue(fields.directionDeveloperResolution);
    await (await $(this.elements.verificationCap)).setValue(fields.verificationCap);
  }
}

export default QuarterlyPage;
