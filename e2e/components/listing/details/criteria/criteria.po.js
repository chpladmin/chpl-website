const elements = {
  removedCriteria: '#removed-header',
  editCriteria: '//span[text()="Edit Criteria"]',
  attestToggle: '#success',
  accept: '//span[text()="Accept"]',
};

class CriteriaComponent {
  constructor() { }

  get removedCriteriaHeader() {
    return $(elements.removedCriteria);
  }

  get editCriteria() {
    return $(elements.editCriteria);
  }

  get attestToggle() {
    return $(elements.attestToggle);
  }

  get accept() {
    return $(elements.accept);
  }

  chipText(text) {
    return $(`//span[text()="${text}"]`);
  }

  expandRemovedCriteria() {
    $(elements.removedCriteria).$$('div')[1].scrollAndClick();
  }

  expandCriteria(id) {
    $(`#criterion-id-${id}-header`).$$('div')[1].scrollAndClick();
  }

  criteriaHeader(id) {
    return $(`#criterion-id-${id}-header`);
  }

  criteriaCount() {
    return $$('//*[starts-with(@id,"criterion-id")]').length;
  }

  criteriaDetailTable(id) {
    return $(`//*[@id="criterion-id-${id}-header"]/parent::div`).$('table');
  }
}

export default CriteriaComponent;
