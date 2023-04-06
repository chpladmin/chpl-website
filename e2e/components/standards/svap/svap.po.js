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

  /* eslint-disable indent */
  async getSvaps() {
    return (await
            (await
             this.svapTable
            ).$('tbody')
           ).$$('tr');
  }
  /* eslint-enable indent */

  async setValue(identifier) {
    await (await this.version).click();
    await browser.keys(['Control', 'a']);
    await browser.keys(['Backspace']);
    await (await this.version).setValue(identifier);
  }
}

export default SvapComponent;
