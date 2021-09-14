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
      saveSurveillanceData: '#save-surveillance-data',
    };
  }

  set(fields) {
    $(this.elements.surveillanceActivity).setValue(fields.surveillanceActivity);
    $(this.elements.reactiveSurveillance).setValue(fields.reactiveSurveillance);
    $(this.elements.prioritizedElement).setValue(fields.prioritizedElement);
    $(this.elements.disclosureSummary).setValue(fields.disclosureSummary);
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
    return $(this.elements.limitationsEvaluation);
  }

  get directionDeveloperResolution() {
    return $(this.elements.directionDeveloperResolution);
  }

  get verificationCap() {
    return $(this.elements.verificationCap);
  }

  saveSurveillanceData() {
    $(this.elements.saveSurveillanceData).click();
  }

  getListingId(row, col) {
    return $('chpl-surveillance-report-relevant-listings').$(`//tbody/tr[${row}]/td[${col}]`).getText();
  }

  editSurveillanceData() {
    $('//*[starts-with(@id,"edit-surveillance-data-")]').click();
  }

  viewSurveillanceData(listingId) {
    $(`#view-listing-data-${listingId}`).scrollAndClick();
  }
}

export default QuarterlyPage;
