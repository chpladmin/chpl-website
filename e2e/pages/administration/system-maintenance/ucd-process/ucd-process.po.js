import SystemMaintenancePage from '../system-maintenance.po';

class UcdProcessPage extends SystemMaintenancePage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      addButton: '#add-new-ucd-process',
      dataTable: 'table[aria-label="UCD Process table"]',
    };
  }
}

export default UcdProcessPage;
