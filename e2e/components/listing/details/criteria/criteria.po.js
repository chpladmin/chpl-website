const elements = {
  removedCriteria: '#removed-header',
};

class CriteriaComponent {
  constructor () { }

  get removedCriteriaHeader () {
    return $(elements.removedCriteria);
  }

  expandRemovedCriteria () {
    $(elements.removedCriteria).$$('div')[1].scrollAndClick();
  }

  expandCriteria (id) {
    $(`#criterion-id-${id}-header`).$$('div')[1].scrollAndClick();
  }

  criteriaCount () {
    return $$('//*[starts-with(@id,"criterion-id")]').length;
  }

  criteriaDetailTable (id) {
    return $(`//*[@id="criterion-id-${id}-header"]/parent::div`).$('table');
  }

}

export default CriteriaComponent;
