import { open } from '../../utilities/hooks';

class ComparePage {
  constructor() {
    this.elements = {
      criteriaRow: (id) => `#criterion-${id}`,
      cqmRow: (id) => `#cqm-${id}`,
      chplProductNumber: (number) => `td*=${number}`,
    };
  }

  async open(ids) {
    await open(`#/compare/${ids.join('&')}`);
    await browser.waitUntil(async () => {
      const table = await $('table');
      const head = await table.$('thead');
      const rows = await head.$$('tr');
      const row = await rows[0];
      const cells = await row.$$('th');
      const isReady = cells.length === (ids.length + 1);
      return isReady;
    });
  }

  async getCellWithCriteriaId(id) {
    return $(this.elements.criteriaRow(id)).$$('td')[0];
  }

  async getCellWithCqmId(id) {
    return $(this.elements.cqmRow(id)).$$('td')[0];
  }

  async findColumnIndex(chplProductNumber) {
    const startCell = await $(this.elements.chplProductNumber(chplProductNumber));
    const row = await startCell.parentElement();
    const cells = await row.$$('td');
    let index, text, isFound;
    for (let i = 0; i < cells.length; i++) {
      text = await cells[i].getText();
      isFound = text === chplProductNumber;
      if (isFound) { index = i; }
    };
    return index;
  }

  async getDecertificationDate(chplProductNumber) {
    const table = await $('table');
    const body = await table.$('tbody');
    const rows = await body.$$('tr');
    let row, test, isFound;
    for (let i = 0; i < rows.length; i++) {
      test = await rows[i].getText();
      isFound = test.includes('Inactive/Decertified Date');
      if (isFound) { row = rows[i] };
    };
    const cells = await row.$$('td');
    const index = await this.findColumnIndex(chplProductNumber);
    const cell = cells[index];
    const text = await cell.getText();
    return text;
  }
}

export default ComparePage;
