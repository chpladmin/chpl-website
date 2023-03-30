class UcdProcessComponent {
  constructor() {
    this.elements = {
      addButton: '#add-new-ucd-process',
      name: '#name',
      dataTable: 'table[aria-label="UCD Process table"]',
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

  async ucdDataAvailable() {
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

  async editUcdProcess(processName) {
    const rows = await this.getData();
    await rows.forEach(async (row) => {
      const cells = await row.$$('td');
      await cells.forEach(async (cell) => {
        if ((await cell.getText()).includes(processName)) {
          await cells[1].click();
        }
      });
    });
  }
}

export default UcdProcessComponent;
