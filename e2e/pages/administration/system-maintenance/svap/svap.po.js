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
      detailsButton: 'button[aria-label="Open SVAP Activity dialog"]',
    };
  }

  get citation() {
    return $(this.elements.citation);
  }

  get criterionSelector() {
    return $(this.elements.criterionSelector);
  }

  get detailsButton() {
    return $(this.elements.detailsButton);
  }
}

export default SvapPage;
