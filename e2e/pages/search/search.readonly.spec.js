import SearchPage from './search.po';
import Hooks from '../../utilities/hooks';

let hooks;
let page;
const path = require('path');
const fs = require('fs');
const config = require('../../config/mainConfig');

const developerName = 'athenahealth, Inc.';
const productName = 'athenaClinicals';
const version = '20';
const totalListing = 500;
const PRODUCT_COL_IDX = 3;
const DEVELOPER_COL_IDX = 2;
const STATUS_COL_IDX = 7;
const EDITION_COL_IDX = 1;

describe('the search page', () => {
  beforeEach(async () => {
    page = new SearchPage();
    hooks = new Hooks();
    await hooks.open('#/search');
  });

  describe('when on the base page', () => {
    it('should have search for a listing text bar', () => {
      expect(page.searchListing.isDisplayed()).toBe(true);
    });

    it('should have "Browse all" button', () => {
      expect(page.browseAllButton.isDisplayed()).toBe(true);
    });

    describe('the button', () => {
      const buttons = [
        { title: 'API Info for 2015 Ed. Products', link: '#/collections/api-documentation' },
        { title: 'Banned Developers', link: '#/collections/developers' },
        { title: 'Charts', link: '#/charts' },
        { title: 'Decertified Products', link: '#/collections/products' },
        { title: 'Inactive Certificates', link: '#/collections/inactive' },
        { title: 'Products: Corrective Action', link: '#/collections/corrective-action' },
        { title: 'SED Info for 2015 Ed. Products', link: '#/collections/sed' },
      ];

      buttons.forEach((button) => {
        describe(`"${button.title}"`, () => {
          it('should be displayed', () => {
            expect(page.homeSearchPageButtons(button.title).isDisplayed()).toBe(true);
          });

          it('should be clickable', () => {
            expect(page.homeSearchPageButtons(button.title).isClickable()).toBe(true);
          });

          it('should have the correct link to the page', () => {
            expect(page.homeSearchPageButtons(button.title).getAttribute('href')).toBe(button.link);
          });
        });
      });
    });
  });

  describe('when browsing all listings', () => {
    beforeEach(() => {
      page.browseAllButton.click();
      if (!page.downloadResultsButton.isDisplayed()) {
        page.browseAllButton.click();
      }
      page.waitForUpdatedListingResultsCount();
    });

    it('should show all listings (more than 500)', () => {
      const count = page.listingTotalCount();
      expect(count).toBeGreaterThan(totalListing);
    });
  });

  describe('When observing listing details button', () => {
    beforeEach(() => {
      page.waitForUpdatedListingResultsCount();
    });

    it('button should go to details page for the listing', () => {
      expect($$('.btn-primary.btn-sm')[1].getAttribute('href')).toContain('/listing/');
    });
  });

  describe('when searching listings by developer', () => {
    beforeEach(() => {
      page.searchForListing(developerName);
      hooks.waitForSpinnerToDisappear();
      page.waitForUpdatedListingResultsCount();
    });

    afterEach(() => {
      page.clearFilters.click();
    });

    it('should only show listings that match the developer', () => {
      const count = page.listingTableFirstPageRowCount();
      for (let i = 1; i <= count; i += 1) {
        expect(page.getColumnText(i, DEVELOPER_COL_IDX)).toContain(developerName);
      }
    });
  });

  describe('when searching listings by product', () => {
    beforeEach(() => {
      page.searchForListing(productName);
      hooks.waitForSpinnerToDisappear();
      page.waitForUpdatedListingResultsCount();
    });

    afterEach(() => {
      page.clearFilters.click();
    });

    it('should only show listings that match the product', () => {
      const count = page.listingTableFirstPageRowCount();
      for (let i = 1; i <= count; i += 1) {
        expect(page.getColumnText(i, PRODUCT_COL_IDX)).toContain(productName);
      }
    });
  });

  describe('when searching listings by ONC-ACB ID', () => {
    const acbId = '170009R00';
    beforeEach(() => {
      page.searchForListing(acbId);
      hooks.waitForSpinnerToDisappear();
      page.waitForUpdatedListingResultsCount();
    });

    afterEach(() => {
      page.clearFilters.click();
    });

    it('should only show the listing that has that ACB ID', () => {
      const count = page.listingTableFirstPageRowCount();
      expect(count).toBe(1);
    });
  });

  describe('when searching listings by CHPL ID', () => {
    const chplId = '15.99.04.3078.Ninj.01.00.0.200629';
    beforeEach(() => {
      page.searchForListing(chplId);
      hooks.waitForSpinnerToDisappear();
      page.waitForUpdatedListingResultsCount();
    });

    afterEach(() => {
      page.clearFilters.click();
    });

    it('should show only the listing that has that CHPL ID', () => {
      const count = page.listingTableFirstPageRowCount();
      expect(count).toBe(1);
    });
  });

  describe('when filtering', () => {
    let countBefore;
    let countAfter;
    beforeEach(() => {
      page.browseAll.click();
      hooks.waitForSpinnerToDisappear();
      page.waitForUpdatedListingResultsCount();
      countBefore = page.listingTotalCount();
    });

    afterEach(() => {
      page.clearFilters.click();
    });

    describe('using certification status as "Retired" ', () => {
      beforeEach(() => {
        page.expandFilterOptions('status').click();
        page.statusRetiredFilterOption.click();
        page.waitForUpdatedListingResultsCount();
      });

      it('should filter listing results', () => {
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeGreaterThan(countBefore);
      });

      it('should at least show 1 retired listing', () => {
        let isInclude = false;
        for (let i = 1; i <= page.listingTableFirstPageRowCount(); i += 1) {
          if (page.getColumnText(i, STATUS_COL_IDX).includes('Retired')) {
            isInclude = true;
            break;
          }
        }
        expect(isInclude).toBe(true);
      });
    });

    describe('using certification edition 2014', () => {
      beforeEach(() => {
        page.expandFilterOptions('edition').click();
        page.edition2014FilterOption.click();
        page.waitForUpdatedListingResultsCount();
      });

      it('should filter listing results', () => {
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeGreaterThan(countBefore);
      });

      it('should at least show 1 2014 listing', () => {
        let isInclude = false;
        for (let i = 1; i <= page.listingTableFirstPageRowCount(); i += 1) {
          if (page.getColumnText(i, EDITION_COL_IDX).includes('2014')) {
            isInclude = true;
            break;
          }
        }
        expect(isInclude).toBe(true);
      });
    });

    describe('using certification criteria 170.315 (a)(1)', () => {
      beforeEach(() => {
        page.expandFilterOptions('criteria').click();
        page.criteria2015FilterExpand.click();
        page.criteria2015FilterOption.click();
        page.waitForUpdatedListingResultsCount();
      });

      it('should filter listing results', () => {
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeLessThan(countBefore);
      });
    });

    describe('with compliance activity', () => {
      beforeEach(() => {
        page.expandFilterOptions('compliance').click();
      });

      afterEach(() => {
        page.clearFilters.click();
      });

      it('should filter listing results on "has never had a compliance activity"', () => {
        page.complianceNeverHadActivityFilter.click();
        page.waitForUpdatedListingResultsCount();
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeLessThan(countBefore);
      });

      it('should filter listing results on "has had a compliance activity"', () => {
        page.complianceHasHadActivityFilter.click();
        page.waitForUpdatedListingResultsCount();
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeLessThan(countBefore);
      });

      describe('while in the "has had a compliance activity" filter', () => {
        beforeEach(() => {
          page.complianceHasHadActivityFilter.click();
          page.waitForUpdatedListingResultsCount();
          countBefore = page.listingTotalCount();
        });

        afterEach(() => {
          page.clearFilters.click();
        });

        it('should filter listing results on "never had"', () => {
          page.complianceNeverHadNonConformityFilter.click();
          page.waitForUpdatedListingResultsCount();
          countAfter = page.listingTotalCount();
          expect(countAfter).toBeLessThan(countBefore);
        });

        it('should filter listing results on "open"', () => {
          page.complianceOpenNonConformityFilter.click();
          page.waitForUpdatedListingResultsCount();
          countAfter = page.listingTotalCount();
          expect(countAfter).toBeLessThan(countBefore);
        });

        it('should filter listing results on "closed"', () => {
          page.complianceClosedNonConformityFilter.click();
          page.waitForUpdatedListingResultsCount();
          countAfter = page.listingTotalCount();
          expect(countAfter).toBeLessThan(countBefore);
        });
      });
    });

    describe('in the "More" dropdown', () => {
      beforeEach(() => {
        page.moreFilterButton.click();
      });

      afterEach(() => {
        page.clearFilters.click();
      });

      describe('the "Clinical Quality Measures" filter', () => {
        it('should filter listing results', () => {
          page.moreFilterExpand(' View Clinical Quality Measures ').click();
          page.moreFilterExpand(' View 2014/2015 Clinical Quality Measures ').click();
          page.moreCqmFilterOptions('CMS2').click();
          page.waitForUpdatedListingResultsCount();
          countAfter = page.listingTotalCount();
          expect(countAfter).toBeLessThan(countBefore);
        });
      });

      describe('the "ONC/ACBs" filter', () => {
        it('should filter listing results', () => {
          page.moreFilterExpand(' View ONC-ACBs ').click();
          page.moreOncAcbFilterOptions('Drummond_Group').click();
          page.waitForUpdatedListingResultsCount();
          countAfter = page.listingTotalCount();
          expect(countAfter).toBeLessThan(countBefore);
        });
      });

      describe('the "Practice Type" filter', () => {
        it('should filter listing results', () => {
          page.moreFilterExpand(' View Practice Type (2011 and 2014 Editions) ').click();
          page.morePracticeTypeDropdownOptions.selectByVisibleText('Inpatient');
          page.waitForUpdatedListingResultsCount();
          countAfter = page.listingTotalCount();
          expect(countBefore).toBeLessThan(countAfter);
        });
      });

      describe('the "Certification Date" filter', () => {
        it('should filter listing results', () => {
          page.moreFilterExpand(' View Certification Date ').click();
          page.moreCertificationEndDateFilter.setValue('01/01/2019');
          page.waitForUpdatedListingResultsCount();
          countAfter = page.listingTotalCount();
          expect(countAfter).toBeLessThan(countBefore);
        });
      });

      describe('the "Developer / Product / Version" filters', () => {
        beforeEach(() => {
          page.moreDeveloperFilter.addValue(developerName);
          page.moreProductFilter.addValue(productName);
          page.moreVersionFilter.addValue(version);
          page.waitForUpdatedListingResultsCount();
        });

        it('should filter listing results', () => {
          countAfter = page.listingTableFirstPageRowCount();
          expect(countAfter).toBeLessThan(countBefore);
        });

        it('should show correct Developer/ Product/ Version name as searched for', () => {
          for (let i = 1; i <= page.listingTableFirstPageRowCount(); i += 1) {
            expect(page.getColumnText(i, 2)).toContain(developerName);
            expect(page.getColumnText(i, 3)).toContain(productName);
            expect(page.getColumnText(i, 4)).toContain(version);
          }
        });
      });
    });
  });

  describe('after searching for a listing', () => {
    beforeEach(() => {
      page.searchForListing(developerName);
      page.waitForUpdatedListingResultsCount();
    });

    it('should clear all filtered results and show all listings with the "clear filters" button', () => {
      page.clearFilters.click();
      page.waitForUpdatedListingResultsCount();
      expect(page.listingTotalCount()).toBeGreaterThan(650);
    });

    it('should show all listings with the "browse all" button', () => {
      page.browseAll.click();
      page.waitForUpdatedListingResultsCount();
      expect(page.listingTotalCount()).toBeGreaterThan(650);
    });
  });

  describe('when downloading results', () => {
    it('should download a file', () => {
      page.downloadResultsButton.click();
      page.downloadResultsAction.click();
      const fileName = 'search-results.csv';
      const filePath = path.join(global.downloadDir, fileName);
      if (!fs.existsSync(filePath)) {
        page.downloadResultsAction.click();
      }
      browser.waitForFileExists(filePath, config.timeout);
      expect(fs.existsSync(filePath)).toBe(true);
    });

    describe('with more than 50 results', () => {
      it('should indicate it will download however many results there are', () => {
        page.pageSize.selectByVisibleText('250');
        page.downloadResultsButton.click();
        expect(page.downloadResultsAction.getText()).toBe('Download 250 displayed results');
      });
    });
  });
});
