import CorrectiveActionPage from './corrective-action.po';
import Hooks from '../../../utilities/hooks';

let hooks; let
  page;
const DEVELOPER_COL_IDX = 2;
const developerName = 'Greenway';
const VERSION_COL_IDX = 4;
const versionName = 'v.12';
const PRODUCT_COL_IDX = 3;
const productName = 'Intergy EHR';
const CHPLID_COL_IDX = 5;
const chplIdName = '15.04.04.2913.Gree.11.01.1.180919';

describe('the Corrective Action collection page', () => {
  beforeEach(async () => {
    page = new CorrectiveActionPage();
    hooks = new Hooks();
    await hooks.open('#/collections/corrective-action');
  });

  describe('after it\'s loaded', () => {
    beforeEach(() => {
      hooks.waitForSpinnerToDisappear();
    });

    it('should have body text', () => {
      expect(page.bodyText.getText()).toBe('This is a list of all health IT products for which a non-conformity has been recorded. A certified product is non-conforming if, at any time, an ONC-Authorized Certification Body (ONC-ACB) or ONC determines that the product does not comply with a requirement of certification. Non-conformities reported as part of surveillance are noted as "Surveillance NCs", while non-conformities identified though an ONC Direct Review are noted as "Direct Review NCs". Not all non-conformities affect a product\'s functionality, and the existence of a non-conformity does not by itself mean that a product is "defective." Developers of certified products are required to notify customers of non-conformities and must take approved corrective actions to address such non-conformities in a timely and effective manner. Detailed information about non-conformities, and associated corrective action plans, can be accessed below by clicking on the product\'s CHPL ID.\nPlease note that by default, only listings that are active or suspended are shown in the search results.');
    });

    it('should have table headers in a defined order', () => {
      const expectedHeaders = ['Edition', 'Developer', 'Product', 'Version', 'CHPL ID', 'ONC-ACB', '# Open Surveillance NCs', '# Closed Surveillance NCs', '# Open Direct Review NCs', '# Closed Direct Review NCs'];
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

      describe('using certification status filter to select withdrawn by developer', () => {
        beforeEach(() => {
          page.selectFilter('certificationStatus', 'Withdrawn_by_Developer');
          page.waitForUpdatedListingResultsCount();
        });

        it('should filter listing results', () => {
          countAfter = page.listingTotalCount();
          expect(countAfter).toBeGreaterThan(countBefore);
        });
      });
      describe('using certification status filter to select open non conformity', () => {
        beforeEach(() => {
          page.selectFilter('nonconformities', 'open-nonconformity');
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
