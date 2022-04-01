import Hooks from '../../../utilities/hooks';

import ApiDocumentationPage from './api-documentation.po';

let hooks;
let page;
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
    const expectedHeaders = ['CHPL ID', 'Certification Edition', 'Developer\nsorted ascending', 'Product', 'Version', 'Certification Status', 'API Documentation', 'Service Base URL List', 'Mandatory Disclosures URL'];
    const actualHeaders = page.getTableHeaders();
    expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    actualHeaders.forEach((header, idx) => {
      expect(header.getText()).toBe(expectedHeaders[idx]);
    });
  });

  it('should have api documentation download button', () => {
    expect(page.downloadApiDocumentation.isDisplayed()).toBe(true);
  });

  describe('when filtering', () => {
    let countBefore;
    let countAfter;
    beforeEach(() => {
      countBefore = page.getListingTotalCount();
    });

    afterEach(() => {
      page.resetFilters();
    });

    describe('when removing "2015"', () => {
      it('should filter listing results', () => {
        page.removeFilter('Certification Edition', '2015');
        countAfter = page.getListingTotalCount();
        expect(countAfter).toBeLessThan(countBefore);
      });
    });

    describe('when adding "withdrawn by developer"', () => {
      it('should filter listing results', () => {
        page.selectFilter('certificationStatuses', 'Withdrawn_by_Developer');
        countAfter = page.getListingTotalCount();
        expect(countAfter).toBeGreaterThan(countBefore);
      });
    });
  });

  describe('when searching by text', () => {
    afterEach(() => {
      page.clearSearchTerm();
    });

    it('should show only listings that match the CHPL ID', () => {
      const columnIndex = 0;
      const searchTerm = '15.04.04';
      page.searchForText(searchTerm);
      expect(page.getTableCellText(page.results[0], columnIndex)).toContain(searchTerm);
    });

    it('should show only listings that match the developer', () => {
      const columnIndex = 2;
      const searchTerm = 'Eprosystem Inc.';
      page.searchForText(searchTerm);
      expect(page.getTableCellText(page.results[0], columnIndex)).toContain(searchTerm);
    });

    it('should show only listings that match the product', () => {
      const columnIndex = 3;
      const searchTerm = 'Veracity';
      page.searchForText(searchTerm);
      expect(page.getTableCellText(page.results[0], columnIndex)).toContain(searchTerm);
    });
  });

  xdescribe('when clicking on api documentation download button', () => {
    it('should download a file', () => {
      page.downloadApiDocButton.click();
      const apiFileName = 'APIDocData';
      browser.pause(config.timeout);
      const files = fs.readdirSync(global.downloadDir);
      const fileName = files.filter((file) => file.match(new RegExp(`${apiFileName}.*.xlsx`))).toString();
      expect(fileName).toContain(apiFileName);
      const filePath = path.join(global.downloadDir, fileName);
      const stat = fs.statSync(filePath);
      expect(stat.size / 1000).toBeGreaterThan(10);
    });
  });
});
