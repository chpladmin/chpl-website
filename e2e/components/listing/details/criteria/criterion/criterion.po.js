class CriterionComponent {
  constructor() {
    this.elements = {
      uiFlagOnElement: 'chpl-certification-criteria',
    };
  }

  criterionHeader(criteriaNumber, id) {
    const flag = this.isUiUpgradeFlagOn();
    if (flag) {
      return $(`#criterion-id-${id}-header`).$('h6');
    }
    return $(`//*[@id="criteria_${criteriaNumber}_details_header"]`).$('.criteria-title');
  }

  isUiUpgradeFlagOn() {
    const canaryElement = $(this.elements.uiFlagOnElement);
    if (canaryElement?.isExisting) {
      return !canaryElement.isExisting();
    }
    return false;
  }
}

export default CriterionComponent;
