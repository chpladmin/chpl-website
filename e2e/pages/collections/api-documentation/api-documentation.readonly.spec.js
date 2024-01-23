import ApiDocumentationPage from './api-documentation.po';

const path = require('path');
const fs = require('fs');

const config = require('../../../config/mainConfig');

let page;

describe('the Api Documentation collection page', () => {
  beforeEach(async () => {
    page = new ApiDocumentationPage();
    await page.open();
  });

  it('should have body text', async () => {
    await expect(await page.getBodyText()).toContain('This list includes all 2015 Edition, including Cures Update, health IT products that have been certified to at least one of the following API Criteria:');
    await expect(await page.getBodyText()).toContain('The Mandatory Disclosures URL is also provided for each health IT product in this list. This is a hyperlink to a page on the developer\'s official website that provides in plain language any limitations and/or additional costs associated with the implementation and/or use of the developer\'s certified health IT.');
  });

  it('should have table headers in a defined order', async () => {
    const expectedHeaders = ['CHPL ID', 'Certification Edition', 'Developer', 'Product', 'Version', 'Status', 'API Documentation', 'Service Base URL List', 'Mandatory Disclosures URL', 'Actions'];
    const actualHeaders = await page.getTableHeaders();
    await expect(actualHeaders.length).toBe(expectedHeaders.length, 'Found incorrect number of columns');
    await actualHeaders.forEach(async (header, idx) => expect(await header.getText()).toBe(expectedHeaders[idx]));
  });

  it('should have api documentation download button', async () => {
    await expect(await (await page.getDownloadApiDocumentation()).isDisplayed()).toBe(true);
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

      it('should filter on criteria', async () => {
        await page.removeFilter('Certification Criteria', '170.315 (g)(7)');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });

      xit('should toggle the criteria operator', async () => {
        await page.toggleOperator('certificationCriteriaIds');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeLessThan(countBefore);
      });

      xit('should filter on status', async () => {
        await page.setListFilter('certificationStatuses', 'Withdrawn_by_Developer');
        countAfter = await page.getTotalResultCount();
        await expect(countAfter).toBeGreaterThan(countBefore);
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
        const columnIndex = 2;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });

      it('should show only listings that match the product', async () => {
        const searchTerm = 'Veracity';
        const columnIndex = 3;
        await page.searchForText(searchTerm);
        await expect(await page.getCellInRow(0, columnIndex)).toContain(searchTerm);
      });
    });
  });

  // ignored as file download is an unsolved test
  xdescribe('when clicking on api documentation download button', () => {
    it('should download a file', async () => {
      await page.downloadApiDocButton.click();
      const apiFileName = 'APIDocData';
      await browser.pause(config.timeout);
      const files = fs.readdirSync(global.downloadDir);
      const fileName = files.filter((file) => file.match(new RegExp(`${apiFileName}.*.xlsx`))).toString();
      await expect(fileName).toContain(apiFileName);
      const filePath = path.join(global.downloadDir, fileName);
      const stat = fs.statSync(filePath);
      await expect(stat.size / 1000).toBeGreaterThan(10);
    });
  });
});
