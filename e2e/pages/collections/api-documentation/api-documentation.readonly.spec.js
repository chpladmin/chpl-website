import ApiDocumentationPage from './api-documentation.po';
import Hooks from '../../../utilities/hooks';

let hooks; let page;
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

      it('should filter listing results', () => {
        page.selectFilter('certificationStatus', 'Withdrawn_by_Developer');
        page.waitForUpdatedListingResultsCount();
        countAfter = page.listingTotalCount();
        expect(countAfter).toBeGreaterThan(countBefore);
      });
    });
  });

  describe('when searching listing by developer', () => {
    const DEVELOPER_COL_IDX = 1;
    const developerName = 'MD Charts';
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
    const VERSION_COL_IDX = 3;
    const versionName = '2018 R1';
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
    const PRODUCT_COL_IDX = 2;
    const productName = 'Acumen EHR';
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
    const CHPLID_COL_IDX = 4;
    const chplIdName = '15.07.07.1582.HC01.03.00.1.200507';
    it('should only show listings that match the product', () => {
      page.searchForListing(chplIdName);
      page.waitForUpdatedListingResultsCount();
      const count = page.listingTotalCount();
      for (let i = 1; i <= count; i++) {
        expect(page.getColumnText(i, CHPLID_COL_IDX)).toContain(chplIdName);
      }
    });
  });

  describe('when clicking on api documentation download button', () => {

    it('should download a file', () => {
      page.downloadApiDocButton.click();
      const fileName = 'APIDocData-20193112.xlsx';
      const filePath = path.join(global.downloadDir, fileName);
      browser.waitForFileExists(filePath, config.timeout);
      expect(fs.existsSync(filePath)).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size / 1000).toBeGreaterThan(10);
    });
  });
});
