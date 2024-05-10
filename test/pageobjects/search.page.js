const { $ } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies
import Page from './page.es6';

class SearchPage extends Page {
  constructor() {
    super();
    this.name = 'SearchPage';
    this.elements = {
      ...this.elements,
      loading: 'body*=Loading',
      header: 'h1',
      table: 'table',
      searchResultsHeader: 'h6=Search Results:',
      filterPanelToggle: '#filter-panel-toggle',
      resetAllFiltersButton: 'button=Reset All Filters',
      filterSearchTermInput: '#filter-search-term-input',
      filterSearchTermGo: '#filter-search-term-go',
      filterChipsSection: '#filter-chips',
      clearSearchTermButton: 'button[aria-label="Clear search"]',
    };
  }

  open (path) {
    return super.open(path);
  }

  async getBodyText() {
    return (await
            (await
             (await
              $(this.elements.header)
             ).parentElement()
            ).nextElement()
           ).getText();
  }

  async isLoading() {
    return (await
            $(this.elements.loading)
           ).isDisplayed();
  }

  async getTableHeaders() {
    return (await
            (await
             $(this.elements.table)
            ).$('thead')
           ).$$('th');
  }

  async hasNoResults() {
    const results = await this.getTotalResultCount();
    return results === 0;
  }

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

  async toggleOperator(category) {
    const initialResultCount = await this.getTotalResultCount();
    await
    (await
     (await
      $(`#${category}-operator-chips-toggle`)
     ).click()
    );
    try {
      await browser.waitUntil(async () => (await this.getTotalResultCount()) !== initialResultCount);
    } catch (err) {
      console.log(`toggleOperator: ${err}`);
    }
  }

  async setDateFilter(category, isBefore, value) {
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
      $(`#filter-panel-secondary-items-${isBefore ? 'Before' : 'After'}`)
     ).addValue(value)
    );
    await browser.keys('Escape');
    try {
      await browser.waitUntil(async () => (await this.getTotalResultCount()) !== initialResultCount);
    } catch (err) {
      console.log(`setDateFilter: ${err}`);
    }
  }

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

  async getResults() {
    return (await
            (await
             $(this.elements.table)
            ).$('tbody')
           ).$$('tr');
  }

  async getCellInRow(rowIdx, colIdx) {
    const row = (await this.getResults())[rowIdx];
    const cell = (await row.$$('td'))[colIdx];
    return cell.getText();
  }

  async clearSearchTerm() {
    await this.searchForText('');
  }

  async searchForText(text) {
    const initialResultCount = await this.getTotalResultCount();
    await (
      await $(this.elements.clearSearchTermButton)
    ).click();
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

  async clearFilter(category, value) {
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
  }
}

export default SearchPage;
