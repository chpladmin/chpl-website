class CriterionComponent {
  constructor() {
    this.originalElements = {};
    this.updatedElements = {};

    const ORIGINAL = 'ORIGINAL';
    const UPDATED = 'UPDATED';
  }

  criterionHeader(criteriaNumber) {
    if (this.uiVersion() === this.ORIGINAL) {
      return $(`//*[@id="criteria_${criteriaNumber}_details_header"]`).$('.criteria-title').getText();
    }
    return null;
  }

  uiVersion() {
    if (!$('chpl-certification-criteria').isExisting()) {
      return this.UPDATED;
    }
    return this.ORIGINAL;
  }
}

export default CriterionComponent;
