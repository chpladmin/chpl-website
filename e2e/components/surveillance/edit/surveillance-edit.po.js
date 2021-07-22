const elements = {
  cancel: '//*[@ng-click="$ctrl.cancel()"]',
  surveillanceDetails: '.col-sm-12.ng-binding',
  requirementTable: '.table-condensed',
  inspectTitle: '#inspect-label',
  edit: '//*[@ng-click="$ctrl.editSurveillance()"]',
  startDate: '#start-date',
  endDate: '#end-date',
  surveillanceType: '#surveillance-type',
  siteSurveilled: '#sites-surveilled',
  save: '//button[text()=" Save"]',
  removeRequirement: '//*[@ng-click="$ctrl.deleteRequirement(req)"]',
  error: '.text-danger.text-left',
  newRequirement: '//*[@ng-click="$ctrl.addRequirement()"]',
  requirementType: '#requirement-type',
  requirementResult: '#result',
  newnonConformity: '//*[@ng-click="$ctrl.addNonconformity()"]',
  nonConformityType: '#nonconformity-type',
  nonConformityStatus: '#nonconformity-status',
  determinationDate: '#date-of-determination',
  summary: '#summary',
  findings: '#findings',
  editRequirement: '//*[@ng-click="$ctrl.editRequirement(req)"]',
  removeNonConformity: '//*[@ng-click="$ctrl.deleteNonconformity(noncon)"]',
  approvalDate: '#cap-approval-date',
  ncStartDate: '#cap-start-date',
  completeDate: '#cap-must-complete-date',
  sites: '#sites-passed',
  totalSites: '#total-sites',
  explanation: '#developer-explanation',
  resolution: '#resolution',
  requirementCapability: '//*[@name="requirement"]',
};

class SurveillanceEditComponent {
  constructor() { }

  get cancel() {
    return $(elements.cancel);
  }

  get requirementCapability() {
    return $(elements.requirementCapability);
  }

  get surveillanceDetails() {
    return $(elements.surveillanceDetails);
  }

  get inspectTitle() {
    return $(elements.inspectTitle);
  }

  get editButton() {
    return $(elements.edit);
  }

  get startDate() {
    return $(elements.startDate);
  }

  get endDate() {
    return $(elements.endDate);
  }

  get surveillanceType() {
    return $(elements.surveillanceType);
  }

  get siteSurveilled() {
    return $(elements.siteSurveilled);
  }

  get saveButton() {
    return $(elements.save);
  }

  get removeButton() {
    return $(elements.removeRequirement);
  }

  get errorMessages() {
    return $(elements.error);
  }

  get newRequirementButton() {
    return $(elements.newRequirement);
  }

  get requirementType() {
    return $(elements.requirementType);
  }

  get requirementResult() {
    return $(elements.requirementResult);
  }

  get newnonConformityButton() {
    return $(elements.newnonConformity);
  }

  get nonConformityType() {
    return $(elements.nonConformityType);
  }

  get nonConformityStatus() {
    return $(elements.nonConformityStatus);
  }

  get determinationDate() {
    return $(elements.determinationDate);
  }

  get summary() {
    return $(elements.summary);
  }

  get findings() {
    return $(elements.findings);
  }

  get approvalDate() {
    return $(elements.approvalDate);
  }

  get ncStartDate() {
    return $(elements.ncStartDate);
  }

  get completeDate() {
    return $(elements.completeDate);
  }

  get sites() {
    return $(elements.sites);
  }

  get totalSites() {
    return $(elements.totalSites);
  }

  get resolution() {
    return $(elements.resolution);
  }

  get explanation() {
    return $(elements.explanation);
  }

  get editRequirement() {
    return $(elements.editRequirement);
  }

  get removeNonConformity() {
    return $(elements.removeNonConformity);
  }

  requirementTableRows() {
    return $(elements.requirementTable).$('tbody').$$('tr');
  }

  requirementName(i) {
    return $(elements.requirementTable).$('tbody').$('tr').$$('td')[i];
  }

  nonConformityTableRows() {
    return $('.table.ng-scope').$('tbody').$$('tr');
  }

  addnonConformity(details, type) {
    this.newnonConformityButton.click();
    this.nonConformityType.selectByVisibleText(details.type);
    this.nonConformityStatus.selectByVisibleText(details.status);
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
