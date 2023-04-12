import SystemMaintenancePage from '../system-maintenance.po';

class SvapPage extends SystemMaintenancePage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      addButton: '#add-new-svap',
      citation: '#regulatory-text-citation',
      itemName: '#approved-standard-version',
      criterionSelector: '#criteria-select',
      dataTable: 'table[aria-label="SVAP table"]',
    };
  }

  get citation() {
    return $(this.elements.citation);
  }

  get criterionSelector() {
    return $(this.elements.criterionSelector);
  }
}

export default SvapPage;
