import SystemMaintenancePage from '../system-maintenance.po';

class TestToolsPage extends SystemMaintenancePage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      addButton: '#add-new-test-tool',
      citation: '#regulatory-text-citation',
      itemName: '#value',
      criterionSelector: '#criteria-select',
      ruleSelector: '#rule',
      testToolStartDay: '#start-day',
      testToolEndDay: '#end-day',
      dataTable: 'table[aria-label="Test Tools table"]',
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

  get testToolStartDay() {
    return $(this.elements.testToolStartDay);
  }

  get testToolEndDay() {
    return $(this.elements.testToolEndDay);
  }
}

export default TestToolsPage;