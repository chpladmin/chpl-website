import ApiDocumentationPage from './api-documentation.po';
import Hooks from '../../../utilities/hooks';

let hooks; let page;
const DEVELOPER_COL_IDX = 1;
const developerName = 'MD Charts';
const VERSION_COL_IDX = 3;
const versionName = '2018 R1';
const PRODUCT_COL_IDX = 2;
const productName = 'Acumen EHR';
const CHPLID_COL_IDX = 4;
const chplIdName = '15.07.07.1582.HC01.03.00.1.200507';
const path = require('path');
const fs = require('fs');
const config = require('../../../config/mainConfig');

describe('the Api Documentation collection page', () => {
  beforeEach(async () => {
    page = new ApiDocumentationPage();
    hooks = new Hooks();
    hooks.open('#/collections/api-documentation');
    await hooks.waitForSpinnerToDisappear();
  });

  it('should have body text', () => {
    expect(page.bodyText.getText()).toContain('This list includes all 2015 Edition, including Cures Update, health IT products that have been certified to at least one of the following API Criteria:');
    expect(page.bodyText.getText()).toContain('The Mandatory Disclosures URL is also provided for each health IT product in this list. This is a hyperlink to a page on the developer\'s official website that provides in plain language any limitations and/or additional costs associated with the implementation and/or use of the developer\'s certified health IT.');
  });

  it('should have table headers in a defined order', () => {
    const expectedHeaders = ['Developer', 'Product', 'Version', 'CHPL ID', 'API Documentation', 'Service Base URL List', 'Mandatory Disclosures URL'];
    const actualHeaders = page.getListingTableHeaders();
    expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    actualHeaders.forEach((header, idx) => {
      expect(header.getText()).toBe(expectedHeaders[idx]);
    });
  });

  it('should have api documentation download button', () => {
    expect(page.downloadApiDocButton.isDisplayed()).toBe(true);
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
      page.downloadApiDocButton.click();
    });

    it('should download a file', () => {
      const fileName = 'APIDocData-20193112.xlsx';
      const filePath = path.join(global.downloadDir, fileName);
      browser.waitForFileExists(filePath, config.timeout);
      expect(fs.existsSync(filePath)).toBe(true);
      const stat = fs.statSync(filePath);
      console.log(stat.size / 1000);
      expect(stat.size / 1000).toBeGreaterThan(10);
    });
  });
});
