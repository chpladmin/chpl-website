class SurveillanceEditComponent {
  constructor() {
    this.elements = {
      approvalDate: '#cap-approval-day',
      cancel: '//*[@ng-click="$ctrl.cancel()"]',
      completeDate: '#cap-must-complete-day',
      determinationDate: '#date-of-determination-day',
      edit: '//*[@ng-click="$ctrl.editSurveillance()"]',
      editRequirement: '//*[@ng-click="$ctrl.editRequirement(req)"]',
      endDate: '#end-day',
      error: '.text-danger.text-left',
      explanation: '#developer-explanation',
      findings: '#findings',
      inspectTitle: '#inspect-label',
      ncStartDate: '#cap-start-day',
      newRequirement: '//*[@ng-click="$ctrl.addRequirement()"]',
      newnonConformity: '//*[@ng-click="$ctrl.addNonconformity()"]',
      nonConformityCloseDate: '#non-conformity-close-day',
      nonConformityStatus: '#nonconformity-status',
      nonConformityType: '#nonconformity-type',
      nonconformityTable: '.table.ng-scope',
      removeNonConformity: '//*[@ng-click="$ctrl.deleteNonconformity(noncon)"]',
      removeRequirement: '//*[@ng-click="$ctrl.deleteRequirement(req)"]',
      requirementCapability: '//*[@name="requirement"]',
      requirementResult: '#result',
      requirementTable: '.table-condensed',
      requirementType: '#requirement-type',
      resolution: '#resolution',
      save: '//button[text()=" Save"]',
      siteSurveilled: '#sites-surveilled',
      sites: '#sites-passed',
      startDate: '#start-day',
      summary: '#summary',
      surveillanceDetails: '.col-sm-12.ng-binding',
      surveillanceType: '#surveillance-type',
      totalSites: '#total-sites',
    };
  }

  get cancel() {
    return $(this.elements.cancel);
  }

  get requirementCapability() {
    return $(this.elements.requirementCapability);
  }

  get surveillanceDetails() {
    return $(this.elements.surveillanceDetails);
  }

  get inspectTitle() {
    return $(this.elements.inspectTitle);
  }

  get editButton() {
    return $(this.elements.edit);
  }

  get startDate() {
    return $(this.elements.startDate);
  }

  get endDate() {
    return $(this.elements.endDate);
  }

  get surveillanceType() {
    return $(this.elements.surveillanceType);
  }

  get siteSurveilled() {
    return $(this.elements.siteSurveilled);
  }

  get saveButton() {
    return $(this.elements.save);
  }

  get removeButton() {
    return $(this.elements.removeRequirement);
  }

  get errorMessages() {
    return $(this.elements.error);
  }

  get newRequirementButton() {
    return $(this.elements.newRequirement);
  }

  get requirementType() {
    return $(this.elements.requirementType);
  }

  get requirementResult() {
    return $(this.elements.requirementResult);
  }

  get newnonConformityButton() {
    return $(this.elements.newnonConformity);
  }

  get nonConformityType() {
    return $(this.elements.nonConformityType);
  }

  get nonConformityStatus() {
    return $(this.elements.nonConformityStatus);
  }

  get determinationDate() {
    return $(this.elements.determinationDate);
  }

  get summary() {
    return $(this.elements.summary);
  }

  get findings() {
    return $(this.elements.findings);
  }

  get approvalDate() {
    return $(this.elements.approvalDate);
  }

  get ncStartDate() {
    return $(this.elements.ncStartDate);
  }

  get completeDate() {
    return $(this.elements.completeDate);
  }

  get sites() {
    return $(this.elements.sites);
  }

  get totalSites() {
    return $(this.elements.totalSites);
  }

  get resolution() {
    return $(this.elements.resolution);
  }

  get explanation() {
    return $(this.elements.explanation);
  }

  get editRequirement() {
    return $(this.elements.editRequirement);
  }

  get removeNonConformity() {
    return $(this.elements.removeNonConformity);
  }

  get nonConformityCloseDate() {
    return $(this.elements.nonConformityCloseDate);
  }

  requirementTableRows() {
    return $(this.elements.requirementTable).$('tbody').$$('tr');
  }

  requirementName(i) {
    return $(this.elements.requirementTable).$('tbody').$('tr').$$('td')[i];
  }

  nonConformityTableRows() {
    return $(this.elements.nonconformityTable).$('tbody').$$('tr');
  }

  addnonConformity(details, type) {
    this.newnonConformityButton.click();
    this.nonConformityType.selectByVisibleText(details.type);
    this.nonConformityCloseDate.setValue(details.nonConformityCloseDate);
    this.determinationDate.setValue(details.determinationDate);
    this.approvalDate.setValue(details.approvalDate);
    this.ncStartDate.setValue(details.startDate);
    this.completeDate.setValue(details.completeDate);
    if (type === 'Randomized') {
      this.sites.setValue(details.sites);
      this.totalSites.setValue(details.totalSites);
    }
    this.summary.setValue(details.summary);
    this.findings.setValue(details.findings);
    this.explanation.setValue(details.explanation);
    if (this.resolution.isEnabled()) {
      this.resolution.setValue(details.resolution);
    }
  }

  editSurveillance() {
    this.editButton.click();
    if (!$('#edit-surveillance-label').isDisplayed()) {
      this.editButton.click();
    }
  }

  addRequirement(type, capability, result) {
    this.newRequirementButton.click();
    this.requirementType.selectByVisibleText(type);
    if (type === 'Other Requirement') {
      this.requirementCapability.setValue(capability);
    } else {
      this.requirementCapability.selectByVisibleText(capability);
    }
    this.requirementResult.selectByVisibleText(result);
  }
}

export default SurveillanceEditComponent;
