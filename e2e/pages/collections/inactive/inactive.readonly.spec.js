import InactivePage from './inactive.po';
import Hooks from '../../../utilities/hooks';

let hooks;
let page;

describe('the Inactive Certificates collection page', () => {
  beforeEach(async () => {
    page = new InactivePage();
    hooks = new Hooks();
    hooks.open('#/collections/inactive');
    await hooks.waitForSpinnerToDisappear();
  });

  it('should have body text', () => {
    expect(page.bodyText.getText()).toContain('This list includes all health IT products that have had their status changed to an "inactive" status on the Certified Health IT Products List (CHPL). This may be simply because the developer no longer supports the product or for other reasons that are not in response to ONC-ACB surveillance, ONC direct review, or a finding of non-conformity. For further descriptions of the certification statuses, please consult the CHPL Public User Guide');
  });

  it('should have table headers in a defined order', () => {
    const expectedHeaders = ['Edition', 'Developer', 'Product', 'Version', 'Inactive As Of', '# of Known Users', '# Last Updated Date', 'ONC-ACB', 'CHPL ID'];
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
      page.clearFilters.click();
    });

    describe('using acb filter to de-select drummond group', () => {
      it('should filter listing results', () => {
        page.selectFilter('acb', 'Drummond_Group');
        page.waitForUpdatedListingResultsCount();
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeLessThan(countBefore);
      });
    });

    describe('using certification edition filter to de-select 2015 cures update', () => {
      it('should filter listing results', () => {
        page.selectFilter('edition', '2015_Cures_Update');
        page.waitForUpdatedListingResultsCount();
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeLessThan(countBefore);
      });
    });

    describe('using date filter', () => {
      it('should filter listing results', () => {
        page.dateFilter.click();
        page.fromDate.setValue('09/01/2017');
        page.toDate.setValue('10/01/2020');
        page.waitForUpdatedListingResultsCount();
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeLessThan(countBefore);
      });
    });
  });

  describe('when searching listing by developer', () => {
    const DEVELOPER_COL_IDX = 2;
    const developerName = 'Altera Digital Health Inc.';
    it('should only show listings that match the developer', () => {
      page.searchForListing(developerName);
      page.waitForUpdatedListingResultsCount();
      const count = page.listingTotalCount();
      for (let i = 1; i <= count; i += 1) {
        expect(page.getColumnText(i, DEVELOPER_COL_IDX)).toContain(developerName);
      }
    });
  });

  describe('when searching listing by version', () => {
    const VERSION_COL_IDX = 4;
    const versionName = 'Version 2.1';
    it('should only show listings that match the version', () => {
      page.searchForListing(versionName);
      page.waitForUpdatedListingResultsCount();
      const count = page.listingTotalCount();
      for (let i = 1; i <= count; i += 1) {
        expect(page.getColumnText(i, VERSION_COL_IDX)).toContain(versionName);
      }
    });
  });

  describe('when searching listing by product', () => {
    const PRODUCT_COL_IDX = 3;
    const productName = 'TouchWorks';
    it('should only show listings that match the product', () => {
      page.searchForListing(productName);
      page.waitForUpdatedListingResultsCount();
      const count = page.listingTotalCount();
      for (let i = 1; i <= count; i += 1) {
        expect(page.getColumnText(i, PRODUCT_COL_IDX)).toContain(productName);
      }
    });
  });

  describe('when searching listing by CHPL ID', () => {
    const CHPLID_COL_IDX = 9;
    const chplIdName = '15.04.04.2891.Alls.AC.00.1.160804';
    it('should only show listings that match the product', () => {
      page.searchForListing(chplIdName);
      page.waitForUpdatedListingResultsCount();
      const count = page.listingTotalCount();
      for (let i = 1; i <= count; i += 1) {
        expect(page.getColumnText(i, CHPLID_COL_IDX)).toContain(chplIdName);
      }
    });
  });
});
