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

  async qmsDataAvailable() {
    return (await $(this.elements.dataTable)).isExisting();
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

  async editQmsStandard(standardName) {
    const rows = await this.getData();
    await rows.forEach(async (row) => {
      const cells = await row.$$('td');
      await cells.forEach(async (cell) => {
        if ((await cell.getText()).includes(standardName)) {
          await cells[1].click();
        }
      });
    });
  }
}
export default QmsStandardComponent;
