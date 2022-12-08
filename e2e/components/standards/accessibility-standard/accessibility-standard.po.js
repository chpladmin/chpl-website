class AccessibilityStandardComponent {
  constructor() {
    this.elements = {
      addButton: '#add-new-accessibility-standard',
      name: '#name',
      dataTable: 'table[aria-label="Accessibility Standard table"]',
    };
  }

  get addButton() {
    return $(this.elements.addButton);
  }

  get name() {
    return $(this.elements.name);
  }

  get dataTable() {
    return $(this.elements.dataTable);
  }

  /* eslint-disable indent */
  async getData() {
    return (await
            (await
             this.dataTable
            ).$('tbody')
           ).$$('tr');
  }
  /* eslint-enable indent */
}

export default AccessibilityStandardComponent;
