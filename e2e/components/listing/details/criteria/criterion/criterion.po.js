class CriterionComponent {
  constructor() {
    this.elements = {
      uiFlagOnElement: 'chpl-certification-criteria',
    };
  }

  criterionHeader(criteriaNumber, id) {
    const flag = this.isUiUpgradeFlagOn();
    if (flag) {
      return $(`//*[@id="criterion-id-${id}-header"]`).$('h6');
    }
    return $(`//*[@id="criteria_${criteriaNumber}_details_header"]`).$('.criteria-title');
  }

  isUiUpgradeFlagOn() {
    const canaryElelment = $(this.elements.uiFlagOnElement);
    if (canaryElelment?.isExisting) {
      return !canaryElelment.isExisting();
    }
    return false;
  }
}

export default CriterionComponent;
