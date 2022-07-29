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
    };
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

  async getListingId(row, col) {
    return (await (await $('chpl-surveillance-report-relevant-listings')).$(`//tbody/tr[${row}]/td[${col}]`)).getText();
  }

  async editSurveillanceData() {
    await (await $('//*[starts-with(@id,"edit-surveillance-data-")]')).click();
  }

  async viewSurveillanceData(listingId) {
    await (await $(`//button[@id="view-listing-data-${listingId}"]`)).click();
  }

  async setSurvData(fields) {
    await $(this.elements.outcome).selectByAttribute('value', fields.outcome);
    await $(this.elements.processType).selectByAttribute('value', fields.processType);
    await $(this.elements.grounds).setValue(fields.grounds);
    await $(this.elements.nonCoformityCause).setValue(fields.nonCoformityCause);
    await $(this.elements.nonConformityNature).setValue(fields.nonConformityNature);
    await $(this.elements.stepsSurveil).setValue(fields.stepsSurveil);
    await $(this.elements.stepsEngage).setValue(fields.stepsEngage);
    await $(this.elements.cost).setValue(fields.cost);
    await $(this.elements.limitationsEvaluation).setValue(fields.limitationsEvaluation);
    await $(this.elements.nondisclosureEvaluation).setValue(fields.nondisclosureEvaluation);
    await $(this.elements.directionDeveloperResolution).setValue(fields.directionDeveloperResolution);
    await $(this.elements.verificationCap).setValue(fields.verificationCap);
  }
}

export default QuarterlyPage;
