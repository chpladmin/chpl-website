import SedPage from './sed.po';

const path = require('path');
const fs = require('fs');

const config = require('../../../config/mainConfig');

let page;

describe('the SED Information page', () => {
  beforeEach(async () => {
    page = new SedPage();
    await page.open();
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('This list includes all health IT products that have been certified with Safety Enhanced Design (SED).');
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['CHPL ID', 'Developer', 'Product', 'Version', 'Status', 'Actions'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
  });

  it('should have sed details download button', async () => {
    await expect(await (await page.getDownloadSedDetails()).isDisplayed()).toBe(true);
  });

  describe('when filtering', () => {
    describe('using predefined filters', () => {
      let countBefore;
      let countAfter;

      beforeEach(async () => {
        countBefore = await page.getTotalResultCount();
      });

      afterEach(async () => {
        await page.resetFilters();
      });

      it('should filter on ONC-ACB', async () => {
        await page.removeFilter('ONC-ACB', 'Drummond Group');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });
    });

    describe('by text', () => {
      afterEach(async () => {
        await page.clearSearchTerm();
      });

      it('should show only listings that match the CHPL ID', async () => {
        const searchTerm = '15.04.04';
        const columnIndex = 0;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only listings that match the developer', async () => {
        const searchTerm = 'Eprosystem Inc.';
        const columnIndex = 1;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only listings that match the product', async () => {
        const searchTerm = 'Veracity';
        const columnIndex = 2;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });
    });
  });

  // ignored as file download is an unsolved test
  xdescribe('when clicking on sed details download button', () => {
    it('should download a file', async () => {
      await page.downloadSedDetails.click();
      const expectedFileName = 'sed';
      await browser.pause(config.timeout);
      const files = fs.readdirSync(global.downloadDir);
      const fileName = files.filter((file) => file.match(new RegExp(`${expectedFileName}.*.xlsx`))).toString();
      await expect(fileName).toContain(expectedFileName);
      const filePath = path.join(global.downloadDir, fileName);
      const stat = fs.statSync(filePath);
      await expect(stat.size / 1000).toBeGreaterThan(10);
    });
  });
});
