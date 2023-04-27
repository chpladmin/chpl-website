import SystemMaintenancePage from "../system-maintenance.po";

class AccessibilityStandard extends SystemMaintenancePage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      addButton: '#add-new-accessibility-standard',
      dataTable: 'table[aria-label="Accessibility Standard table"]',
    };
  }
}

export default AccessibilityStandard;
