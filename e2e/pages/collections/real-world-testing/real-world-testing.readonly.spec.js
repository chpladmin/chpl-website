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

  it('should have body text', () => {
    expect(page.bodyText.getText()).toContain('This list includes Health IT Module(s) eligible for Real World Testing, which is an annual');
    expect(page.bodyText.getText()).toContain('If applicable, Real World Testing plans are required to be made publicly available on the CHPL annually by December 15th. Additionally, Real World Testing results are to be made publicly available on the CHPL by March 15th of the subsequent year.');
  });

  it('should have table headers in a defined order', () => {
    const expectedHeaders = ['CHPL ID', 'Certification Edition', 'Developer\nsorted ascending', 'Product', 'Version', 'Certification Status', 'Real World Testing Plans URL', 'Real World Testing Results URL'];
    const actualHeaders = page.getTableHeaders();
    expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    actualHeaders.forEach((header, idx) => {
      expect(header.getText()).toBe(expectedHeaders[idx]);
    });
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
      const searchTerm = 'CorrecTek';
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

  xdescribe('when clicking on all RWT download button', () => {
    it('should download a file', () => {
      page.downloadRealWorldTesting.click();
      const expectedFileName = 'real-world-testing';
      browser.pause(config.timeout);
      const files = fs.readdirSync(global.downloadDir);
      const fileName = files.filter((file) => file.match(new RegExp(`${expectedFileName}.*.csv`))).toString();
      expect(fileName).toContain(expectedFileName);
      const filePath = path.join(global.downloadDir, fileName);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(10);
    });
  });
});
