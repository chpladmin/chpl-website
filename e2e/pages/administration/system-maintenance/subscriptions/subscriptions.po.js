import SystemMaintenancePage from '../system-maintenance.po';

class SubscriptionsPage extends SystemMaintenancePage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      dataTable: 'table[aria-label="Manage Subscriptions table"]',
    };
  }

 async getTableHeaders() {
    return (await
            (await
             $(this.elements.dataTable)
            ).$('thead')
           ).$$('th');
  }

}

export default SubscriptionsPage;
