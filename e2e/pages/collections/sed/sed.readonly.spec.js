import SedPage from './sed.po';
import Hooks from '../../../utilities/hooks';

let hooks; let page;
const DEVELOPER_COL_IDX = 1;
const developerName = 'Allscripts';
const VERSION_COL_IDX = 3;
const versionName = '2017.1.1';
const PRODUCT_COL_IDX = 2;
const productName = 'Helios';
const CHPLID_COL_IDX = 4;
const chplIdName = '15.02.02.1044.A093.01.00.1.190329';
const path = require('path');
const fs = require('fs');
const config = require('../../../config/mainConfig');

describe('the SED Information for 2015 Edition Products collection page', () => {
  beforeEach(async () => {
    page = new SedPage();
    hooks = new Hooks();
    hooks.open('#/collections/sed');
    await hooks.waitForSpinnerToDisappear();
    });

    it('should have body text', () => {
      expect(page.bodyText.getText()).toContain('This list includes all 2015 Edition, including Cures Update, health IT products that have been certified with Safety Enhanced Design (SED):');
    });

    it('should have table headers in a defined order', () => {
      const expectedHeaders = ['Developer', 'Product', 'Version', 'CHPL ID','Details'];
      const actualHeaders = page.getListingTableHeaders();
      expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
      actualHeaders.forEach((header, idx) => {
        expect(header.getText()).toBe(expectedHeaders[idx]);
      });
    });

    it('should have sed details download button', () => {
      expect(page.sedDetailsDownloadButton.isDisplayed()).toBe(true);
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

    describe('when clicking on api documentation download button', () => {
      beforeEach(() => {
        page.sedDetailsDownloadButton.click();
      });

      it('should download a file', () => {
        let fileName;
        const sedFileName = 'chpl-sed-all-details';
        browser.pause(config.timeout); // can't add explicit timeout as file name is dynamic here
        let files = fs.readdirSync( global.downloadDir );
        fileName = files.filter( file => file.match(new RegExp(sedFileName + `.*.csv`))).toString();
        expect(fileName).toContain(sedFileName);
      });
    });
});
