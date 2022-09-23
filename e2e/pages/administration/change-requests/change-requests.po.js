import { open as openPage } from '../../../utilities/hooks.async';

class ChangeRequestsPage {
  constructor() {
    this.elements = {
      searchResultsHeader: 'h6=Search Results:',
      table: 'table[aria-label="Change Requests table"]',
      filterPanelToggle: '#filter-panel-toggle',
      resetAllFiltersButton: 'button=Reset All Filters',
      filterSearchTermInput: '#filter-search-term-input',
      filterSearchTermGo: '#filter-search-term-go',
      filterChipsSection: '#filter-chips',
    };
  }

  async open() {
    await openPage('#/administration/change-requests');
    await (browser.waitUntil(async () => (await $(this.elements.searchResultsHeader)).isDisplayed()));
  }

/* eslint-disable indent */
  async getTableHeaders() {
    return (await
            (await
             $(this.elements.table)
            ).$('thead')
           ).$$('th');
  }
  /* eslint-enable indent */

  async hasNoResults() {
    const results = await this.getTotalResultCount();
    return results === 0;
  }

  /* eslint-disable indent */
  async getTotalResultCount() {
    const results = (await
                     (await
                      (await
                       (await
                        $(this.elements.searchResultsHeader)
                       ).parentElement()
                      ).$('p')
                     ).getText()
                    );
    return results === 'No results found' ? 0 : parseInt(results.split(' ')[2], 10);
  }
  /* eslint-enable indent */

  /* eslint-disable indent */
  async resetFilters() {
    const initialResultCount = await this.getTotalResultCount();
    await
    (await
     $(this.elements.filterPanelToggle)
    ).click();
    await
    (await
     $(this.elements.resetAllFiltersButton)
    ).click();
    await browser.keys('Escape');
    await browser.waitUntil(async () => (await this.getTotalResultCount()) !== initialResultCount);
  }
  /* eslint-enable indent */

  /* eslint-disable indent */
  async removeFilter(category, value) {
    const initialResultCount = await this.getTotalResultCount();
    await
    (await
     (await
      (await
       (await
        (await
         (await
          (await
           $(this.elements.filterChipsSection)
          ).$(`p=${category}`)
         ).parentElement()
        ).$(`span=${value}`)
       ).parentElement()
      ).$('svg')
     ).click()
    );
    try {
      await browser.waitUntil(async () => (await this.getTotalResultCount()) !== initialResultCount);
    } catch (err) {
      console.log(`removeFilter: ${err}`);
    }
  }
  /* eslint-enable indent */

  /* eslint-disable indent */
  async setListFilter(category, value) {
    const initialResultCount = await this.getTotalResultCount();
    await
    (await
     (await
      $(this.elements.filterPanelToggle)
     ).click()
    );
    await
    (await
     (await
      $(`#filter-panel-primary-items-${category}`)
     ).click()
    );
    await
    (await
     (await
      $(`#filter-panel-secondary-items-${value}`)
     ).click()
    );
    await browser.keys('Escape');
    try {
      await browser.waitUntil(async () => (await this.getTotalResultCount()) !== initialResultCount);
    } catch (err) {
      console.log(`setListFilter: ${err}`);
    }
  }
  /* eslint-enable indent */

  /* eslint-disable indent */
  async getResults() {
    return (await
            (await
             $(this.elements.table)
            ).$('tbody')
           ).$$('tr');
  }
  /* eslint-enable indent */

  async getCellInRow(rowIdx, colIdx) {
    const row = (await this.getResults())[rowIdx];
    const cell = (await row.$$('td'))[colIdx];
    return cell.getText();
  }

  /* eslint-disable indent */
  async searchForText(text) {
    const initialResultCount = await this.getTotalResultCount();
    await (
      await $(this.elements.filterSearchTermInput)
    ).setValue(text);
    await (
      await $(this.elements.filterSearchTermGo)
    ).click();
    try {
      await browser.waitUntil(async () => (await this.getTotalResultCount()) !== initialResultCount);
    } catch (err) {
      console.log(`searchForText: ${err}`);
    }
  }
  /* eslint-enable indent */
}

export default ChangeRequestsPage;
