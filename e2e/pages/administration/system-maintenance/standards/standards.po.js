import SystemMaintenancePage from '../system-maintenance.po';

class standardsPage extends SystemMaintenancePage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      addButton: '#add-new-standard',
      citation: '#regulatory-text-citation',
      itemName: '#value',
      criterionSelector: '#criteria-select',
      ruleSelector: '#rule',
      standardStartDay: '#start-day',
      standardReqDay: '#required-day',
      standardEndDay: '#end-day',
      additionalInformation: '#additional-information',
      dataTable: 'table[aria-label="Standards table"]',
      detailsButton: 'button[aria-label="Open Standards Activity dialog"]',
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

  get standardStartDay() {
    return $(this.elements.standardStartDay);
  }

  get standardReqDay() {
    return $(this.elements.standardReqDay);
  }

  get standardEndDay() {
    return $(this.elements.standardEndDay);
  }

  get additionalInformation() {
    return $(this.elements.additionalInformation);
  }

  get detailsButton() {
    return $(this.elements.detailsButton);
  }
}

export default standardsPage;