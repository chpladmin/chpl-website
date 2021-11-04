import Hooks from '../../../utilities/hooks';

import RealWorldTestingPage from './real-world-testing.po';

const path = require('path');
const fs = require('fs');

const config = require('../../../config/mainConfig');

let hooks;
let page;

describe('the Real World Testing collection page', () => {
  beforeEach(async () => {
    page = new RealWorldTestingPage();
    hooks = new Hooks();
    hooks.open('#/collections/real-world-testing');
    await hooks.waitForSpinnerToDisappear();
  });

  xit('should have body text', () => {
    expect(page.bodyText.getText()).toContain('This list includes all 2015 Edition, including Cures Update, health IT products that have been certified to at least one of the following API Criteria:');
    expect(page.bodyText.getText()).toContain('The Mandatory Disclosures URL is also provided for each health IT product in this list. This is a hyperlink to a page on the developer\'s official website that provides in plain language any limitations and/or additional costs associated with the implementation and/or use of the developer\'s certified health IT.');
  });

  it('should have table headers in a defined order', () => {
    const expectedHeaders = ['CHPL ID', 'Developer\nsorted ascending', 'Product', 'Version', 'Status/Edition', 'Real World Testing Plans URL', 'Real World Testing Results URL'];
    const actualHeaders = page.getTableHeaders();
    expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    actualHeaders.forEach((header, idx) => {
      expect(header.getText()).toBe(expectedHeaders[idx]);
    });
  });

  it('should have rwt download button', () => {
    expect(page.downloadAllRwtButton.isDisplayed()).toBe(true);
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
      const columnIndex = 1;
      const searchTerm = 'CorrecTek';
      page.searchForText(searchTerm);
      expect(page.getTableCellText(page.results[0], columnIndex)).toContain(searchTerm);
    });

    it('should show only listings that match the product', () => {
      const columnIndex = 2;
      const searchTerm = 'Veracity';
      page.searchForText(searchTerm);
      expect(page.getTableCellText(page.results[0], columnIndex)).toContain(searchTerm);
    });
  });

  xdescribe('when clicking on all RWT download button', () => {
    it('should download a file', () => {
      page.downloadAllRwtButton.click();
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
