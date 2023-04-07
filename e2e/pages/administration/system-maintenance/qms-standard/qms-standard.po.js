import SystemMaintenancePage from '../system-maintenance.po';

class QmsStandardPage extends SystemMaintenancePage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      dataTable: 'table[aria-label="QMS Standard table"]',
      addButton: '#add-new-qms-standard',
    };
  }
}

export default QmsStandardPage;
