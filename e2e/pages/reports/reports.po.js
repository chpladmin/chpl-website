class ReportsPage {
  constructor() {
    this.elements = {
      title: 'h1=CHPL Reports',
      results: 'table',
      filterSearchTermInput: '#data-filter',
      loadingIndicator: 'div.progress-bar',
    };
  }

  async getTitle() {
    return (await $(this.elements.title)).getText();
  }

  async waitForLoad() {
    await (await $(this.elements.loadingIndicator)).waitForExist();
    await (await $(this.elements.loadingIndicator)).waitForExist({
      reverse: true,
      timeout: 1000 * 60,
    });
  }

  /* eslint-disable indent */
  async getTableHeaders() {
    return (await
            (await
             $(this.elements.results)
            ).$('thead')
           ).$$('th');
  }
  /* eslint-enable indent */

  /* eslint-disable indent */
  async getTotalResultCount() {
    const table = await $(this.elements.results);
    const head = await table.$('thead');
    const cells = await head.$$('td');
    const cell = await cells[0];
    const results = (await
                     (await
                      (await
                       (await
                        (await
                         (await
                          cell
                         ).$('div')
                        ).$('div')
                       ).$('div')
                      ).$('div')
                     ).getText()
                    );
    return results === 'No results found' ? 0 : parseInt(results.split(' ')[4], 10);
  }
  /* eslint-enable indent */

  async clearSearchTerm() {
    await this.searchForText('');
  }

  /* eslint-disable indent */
  async searchForText(text) {
    const initialResultCount = await this.getTotalResultCount();
    await (
      await $(this.elements.filterSearchTermInput)
    ).setValue(text);
    try {
      await browser.waitUntil(async () => (await this.getTotalResultCount()) !== initialResultCount);
    } catch (err) {
      console.log(`searchForText: ${err}`);
    }
  }
  /* eslint-enable indent */

  /* eslint-disable indent */
  async getResults() {
    return (await
            (await
             $(this.elements.results)
            ).$('tbody')
           ).$$('tr');
  }
  /* eslint-enable indent */

  async getCellInRow(rowIdx, colIdx) {
    const row = (await this.getResults())[rowIdx];
    const cell = (await row.$$('td'))[colIdx];
    return cell.getText();
  }
}

export default ReportsPage;
