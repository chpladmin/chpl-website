import SystemMaintenancePage from '../system-maintenance.po';

class FunctionalitiesTestedPage extends SystemMaintenancePage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      addButton: '#add-new-functionality-tested',
      citation: '#regulatory-text-citation',
      itemName: '#value',
      criterionSelector: '#criteria-select',
      ruleSelector: '#rule',
      funtionalityTestedStartDay: '#start-day',
      funtionalityTestedReqDay: '#required-day',
      funtionalityTestedEndDay: '#end-day',
      practiceType: '#practiceType',
      additionalInformation: '#additional-information',
      dataTable: 'table[aria-label="Functionalities Tested table"]',
      detailsButton: 'button[aria-label="Open Functionalities Tested Activity dialog"]',
    };
  }

  get citation() {
    return $(this.elements.citation);
  }

  get criterionSelector() {
    return $(this.elements.criterionSelector);
  }

  get ruleSelector() {
    return $(this.elements.ruleSelector);
  }

  get practiceType() {
    return $(this.elements.practiceType);
  }

  get funtionalityTestedStartDay() {
    return $(this.elements.funtionalityTestedStartDay);
  }

  get funtionalityTestedReqDay() {
    return $(this.elements.funtionalityTestedReqDay);
  }

  get funtionalityTestedEndDay() {
    return $(this.elements.funtionalityTestedEndDay);
  }

  get additionalInformation() {
    return $(this.elements.additionalInformation);
  }

  get detailsButton() {
    return $(this.elements.detailsButton);
  }
}

export default FunctionalitiesTestedPage;