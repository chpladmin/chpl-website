class SvapComponent {
  constructor() {
    this.elements = {
      addButton: '#add-new-svap',
      citation: '#regulatory-text-citation',
      version: '#approved-standard-version',
      criterionSelector: '#criteria-select',
      svapTable: 'table[aria-label="SVAP table"]',
    };
  }

  get addButton() {
    return $(this.elements.addButton);
  }

  get citation() {
    return $(this.elements.citation);
  }

  get version() {
    return $(this.elements.version);
  }

  get criterionSelector() {
    return $(this.elements.criterionSelector);
  }

  get svapTable() {
    return $(this.elements.svapTable);
  }

  async svapDataAvailable() {
    return (await $(this.elements.svapTable)).isExisting();
  }

  /* eslint-disable indent */
  async getSvaps() {
    return (await
            (await
             this.svapTable
            ).$('tbody')
           ).$$('tr');
  }
  /* eslint-enable indent */

  async editSvap(version) {
    const rows = await this.getSvaps();
    await rows.forEach(async (row) => {
      const cells = await row.$$('td');
      await cells.forEach(async (cell) => {
        if ((await cell.getText()).includes(version)) {
          await cells[4].click();
        }
      });
    });
  }
}

export default SvapComponent;
