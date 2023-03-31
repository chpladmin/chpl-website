class QmsStandardComponent {
  constructor() {
    this.elements = {
      addButton: '#add-new-qms-standard',
      name: '#name',
      dataTable: 'table[aria-label="QMS Standard table"]',
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
export default QmsStandardComponent;
