import CmsLookupPage from './cms-lookup.po';
import inputs from './cms-lookup-dp';

const path = require('path');
const fs = require('fs');

const config = require('../../../config/mainConfig');

let page;

describe('on the CMS ID reverse look up page', async () => {
  beforeEach(async () => {
    page = new CmsLookupPage();
    await page.open();
  });

  inputs.forEach((input) => {
    const { testName } = input;
    describe(`when searching for an existing CMS ID made up of ${testName}`, () => {
      beforeEach(async () => {
        await page.clear();
        page.search(input.cmsId);
      });

      it('should show the listings that made up the ID', async () => {
        const listings = (await Promise.all(
          (await page.getResults()).map(async (row) => (await row.$$('td'))[5].getText()),
        )).join(',');
        await expect(listings).toBe(input.chplProductNumbers.toString());
      });

      it('should have download results button and download file should contain the Listings', async () => {
        await page.downloadResultsButton.click();
        const fileName = `CMS_ID.${input.cmsId}.csv`;
        const filePath = path.join(global.downloadDir, fileName);
        if (!fs.existsSync(filePath)) {
          await page.downloadResultsButton.click();
        }
        await browser.waitForFileExists(filePath, config.timeout);
        await expect(fs.existsSync(filePath)).toBe(true);
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        let count = 0;
        for (let k = 0; k < input.chplProductNumbers.length; k += 1) {
          if (fileContents.includes(input.chplProductNumbers[k])) {
            count += 1;
          }
        }
        await expect(count).toBe(input.chplProductNumbers.length);
      });
    });
  });

  describe('when searching for invalid CMS IDs', () => {
    const invalidCmsId = '000000AAAAAA111';
    beforeEach(async () => {
      await page.clear();
      page.search(invalidCmsId);
    });

    it('should show an error message', async () => {
      await expect(await (await page.getInvalidText(invalidCmsId)).getText()).toBe(`The CMS ID "${invalidCmsId}" is invalid, or not found`);
    });

    it('should not have the download results button', async () => {
      await expect(await page.downloadResultsButton.isExisting()).toBe(false);
    });
  });
});
