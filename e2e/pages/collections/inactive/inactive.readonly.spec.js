import InactivePage from './inactive.po';
import Hooks from '../../../utilities/hooks';

let hooks; let page;
const DEVELOPER_COL_IDX = 2;
const developerName = 'Allscripts';
const VERSION_COL_IDX = 4;
const versionName = 'Version 2.1';
const PRODUCT_COL_IDX = 3;
const productName = 'TouchWorks';
const CHPLID_COL_IDX = 9;
const chplIdName = '15.04.04.2891.Alls.AC.00.1.160804';

describe('the Inactive Certificates collection page', () => {
  beforeEach(async () => {
    page = new InactivePage();
    hooks = new Hooks();
    await hooks.open('#/collections/inactive');
  });

  describe('after it\'s loaded', () => {
    beforeEach(() => {
      hooks.waitForSpinnerToDisappear();
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

      describe('using acb filter to de select drummond group', () => {
        beforeEach(() => {
          page.selectFilter('acb', 'Drummond_Group');
          page.waitForUpdatedListingResultsCount();
        });

        it('should filter listing results', () => {
          countAfter = page.listingTotalCount();
          expect(countAfter).toBeLessThan(countBefore);
        });
      });

      describe('using certification edition filter to de select 2015 cures update', () => {
        beforeEach(() => {
          page.selectFilter('edition', '2015_Cures_Update');
          page.waitForUpdatedListingResultsCount();
        });

        it('should filter listing results', () => {
          countAfter = page.listingTotalCount();
          expect(countAfter).toBeLessThan(countBefore);
        });
      });

      describe('using date filter', () => {
        beforeEach(() => {
          page.dateFilter.click();
          page.fromDate.addValue('09/01/2017');
          page.toDate.addValue('10/01/2020');
          page.waitForUpdatedListingResultsCount();
        });

        it('should filter listing results', () => {
          countAfter = page.listingTotalCount();
          expect(countAfter).toBeLessThan(countBefore);
        });
      });
    });

    describe('when searching listing by developer', () => {
      beforeEach(() => {
        page.searchForListing(developerName);
        page.waitForUpdatedListingResultsCount();
      });

      it('should only show listings that match the developer', () => {
        const count = page.listingTotalCount();
        for (let i = 1; i <= count; i++) {
          expect(page.getColumnText(i, DEVELOPER_COL_IDX)).toContain(developerName);
        }
      });
    });
    describe('when searching listing by version', () => {
      beforeEach(() => {
        page.searchForListing(versionName);
        page.waitForUpdatedListingResultsCount();
      });

      it('should only show listings that match the version', () => {
        const count = page.listingTotalCount();
        for (let i = 1; i <= count; i++) {
          expect(page.getColumnText(i, VERSION_COL_IDX)).toContain(versionName);
        }
      });
    });
    describe('when searching listing by product', () => {
      beforeEach(() => {
        page.searchForListing(productName);
        page.waitForUpdatedListingResultsCount();
      });

      it('should only show listings that match the product', () => {
        const count = page.listingTotalCount();
        for (let i = 1; i <= count; i++) {
          expect(page.getColumnText(i, PRODUCT_COL_IDX)).toContain(productName);
        }
      });
    });
    describe('when searching listing by CHPL ID', () => {
      beforeEach(() => {
        page.searchForListing(chplIdName);
        page.waitForUpdatedListingResultsCount();
      });

      it('should only show listings that match the product', () => {
        const count = page.listingTotalCount();
        for (let i = 1; i <= count; i++) {
          expect(page.getColumnText(i, CHPLID_COL_IDX)).toContain(chplIdName);
        }
      });
    });
  });
});
