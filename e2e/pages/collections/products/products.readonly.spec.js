import ProductsPage from './products.po';
import Hooks from '../../../utilities/hooks';

let hooks; let page;

describe('the Decertified Products collection page', () => {
  beforeEach(async () => {
    page = new ProductsPage();
    hooks = new Hooks();
    hooks.open('#/collections/products');
    await hooks.waitForSpinnerToDisappear();
  });

  it('should have body text', () => {
    expect(page.bodyText.getText()).toContain('This list includes all health IT products that have had their status changed to a "decertified" status on the Certified Health IT Products List (CHPL). A product may be decertified for the following reasons: certificate terminated by ONC, certificate withdrawn by an ONC-ACB, or certification withdrawn by an ONC-ACB because the health IT developer requested it to be withdrawn when the product was under ONC-ACB surveillance or ONC direct review. For further descriptions of the certification statuses, please consult the CHPL Public User Guide.');
  });

  it('should have table headers in a defined order', () => {
    const expectedHeaders = ['Edition', 'Developer', 'Product', 'Version', 'Date', '# of Known Users', '# Last Updated Date', 'ONC-ACB', 'CHPL ID', 'Status'];
    const actualHeaders = page.getListingTableHeaders();
    expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    actualHeaders.forEach((header, idx) => {
      expect(header.getText()).toBe(expectedHeaders[idx]);
    });
  });

  describe('when filtering', () => {
    let countBefore;
    let countAfter;
    beforeEach(() => {
      countBefore = page.listingTotalCount();
    });

    afterEach(() => {
      page.clearFilters.scrollAndClick();
    });

    describe('using acb filter to de select drummond group', () => {

      it('should filter listing results', () => {
        page.selectFilter('acb', 'Drummond_Group');
        page.waitForUpdatedListingResultsCount();
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeLessThan(countBefore);
      });
    });

    describe('using certification edition filter to de select 2015 cures update', () => {

      it('should filter listing results', () => {
        page.selectFilter('edition', '2015_Cures_Update');
        page.waitForUpdatedListingResultsCount();
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeLessThan(countBefore);
      });
    });

    describe('using certification status filter to select withdrawn by ONC-ACB', () => {

      it('should filter listing results', () => {
        page.selectFilter('certificationStatus', 'Withdrawn_by_ONC-ACB');
        page.waitForUpdatedListingResultsCount();
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeLessThanOrEqual(countBefore);
      });
    });

    describe('using date filter', () => {

      it('should filter listing results', () => {
        page.dateFilter.scrollAndClick();
        page.fromDate.addValue('09/01/2017');
        page.toDate.addValue('10/01/2020');
        page.waitForUpdatedListingResultsCount();
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeLessThan(countBefore);
      });
    });
  });

  describe('when searching listing by developer', () => {
    const DEVELOPER_COL_IDX = 2;
    const developerName = 'LifeSource';
    it('should only show listings that match the developer', () => {
      page.searchForListing(developerName);
      page.waitForUpdatedListingResultsCount();
      const count = page.listingTotalCount();
      for (let i = 1; i <= count; i++) {
        expect(page.getColumnText(i, DEVELOPER_COL_IDX)).toContain(developerName);
      }
    });
  });

  describe('when searching listing by version', () => {
    const VERSION_COL_IDX = 4;
    const versionName = 'Version 7';
    it('should only show listings that match the version', () => {
      page.searchForListing(versionName);
      page.waitForUpdatedListingResultsCount();
      const count = page.listingTotalCount();
      for (let i = 1; i <= count; i++) {
        expect(page.getColumnText(i, VERSION_COL_IDX)).toContain(versionName);
      }
    });
  });

  describe('when searching listing by product', () => {
    const PRODUCT_COL_IDX = 3;
    const productName = 'AtTheScene';
    it('should only show listings that match the product', () => {
      page.searchForListing(productName);
      page.waitForUpdatedListingResultsCount();
      const count = page.listingTotalCount();
      for (let i = 1; i <= count; i++) {
        expect(page.getColumnText(i, PRODUCT_COL_IDX)).toContain(productName);
      }
    });
  });

  describe('when searching listing by CHPL ID', () => {
    const CHPLID_COL_IDX = 9;
    const chplIdName = '15.04.04.2943.Soci.01.00.1.161215';
    it('should only show listings that match the product', () => {
      page.searchForListing(chplIdName);
      page.waitForUpdatedListingResultsCount();
      const count = page.listingTotalCount();
      for (let i = 1; i <= count; i++) {
        expect(page.getColumnText(i, CHPLID_COL_IDX)).toContain(chplIdName);
      }
    });
  });
});
