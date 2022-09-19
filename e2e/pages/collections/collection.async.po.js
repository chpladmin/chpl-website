/* eslint-disable class-methods-use-this */
const elements = {
  loading: 'body*=Loading',
  table: 'table',
  searchResultsHeader: 'h6=Search Results:',
//  downloadFilteredListings: '#download-filtered-listings',
  filterPanelToggle: '#filter-panel-toggle',
  resetAllFiltersButton: 'button=Reset All Filters',
  filterSearchTermInput: '#filter-search-term-input',
  filterSearchTermGo: '#filter-search-term-go',
  filterChipsSection: '#filter-chips',
};

class CollectionPage {
  async isLoading() {
    return (await
            $(elements.loading)
           ).isDisplayed();
  }

  async getTableHeaders() {
    return (await
            (await
             $(elements.table)
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
                        $(elements.searchResultsHeader)
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
     $(elements.filterPanelToggle)
    ).click();
    await
    (await
     $(elements.resetAllFiltersButton)
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
           $(elements.filterChipsSection)
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
      console.log('removeFilter' + err);
    }
  }

  async setDateFilter(category, isBefore, value) {
    const initialResultCount = await this.getTotalResultCount();
    await
    (await
     (await
      $(elements.filterPanelToggle)
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
      console.log('setDateFilter' + err);
    }
  }

  async setListFilter(category, value) {
    const initialResultCount = await this.getTotalResultCount();
    await
    (await
     (await
      $(elements.filterPanelToggle)
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
      console.log('setListFilter' + err);
    }
  }

  async getResults() {
    return (await
            (await
             $(elements.table)
            ).$('tbody')
           ).$$('tr');
  }

  async getCellInRow(rowIdx, colIdx) {
    const row = (await this.getResults())[rowIdx];
    const cell = (await row.$$('td'))[colIdx];
    console.log({row, cell});
    return await cell.getText();
  }

  async clearSearchTerm() {
    await this.searchForText('');
  }

  async searchForText(text) {
    const initialResultCount = await this.getTotalResultCount();
    await (
      await $(elements.filterSearchTermInput)
    ).setValue(text);
    await (
      await $(elements.filterSearchTermGo)
    ).click();
    try {
      await browser.waitUntil(async () => (await this.getTotalResultCount()) !== initialResultCount);
    } catch (err) {
      console.log('searchForText' + err);
    }
  }
}

export default CollectionPage;
