import Hooks from '../../../utilities/hooks';

import CmsLookupPage from './cms-lookup.po';
import inputs from './cms-lookup-dp';

const path = require('path');
const fs = require('fs');

const config = require('../../../config/mainConfig');

let page;
let hooks;

beforeAll(async () => {
  page = new CmsLookupPage();
  hooks = new Hooks();
  await hooks.open('#/resources/cms-lookup');
});

describe('on the CMS ID reverse look up page', () => {
  inputs.forEach((input) => {
    const { testName } = input;
    describe(`when searching for an existing CMS ID made up of ${testName}`, () => {
      beforeEach(() => {
        page.clear();
        page.search(input.cmsId);
      });

      it('should show the listings that made up the ID', () => {
        const listings = page.getResults().map((row) => row.$$('td')[5].getText()).join(',');
        expect(listings).toBe(input.chplProductNumbers.toString());
      });

      it('should have download results button and download file should contain the Listings', () => {
        page.downloadResultsButton.click();
        const fileName = `CMS_ID.${input.cmsId}.csv`;
        const filePath = path.join(global.downloadDir, fileName);
        if (!fs.existsSync(filePath)) {
          page.downloadResultsButton.click();
        }
        browser.waitForFileExists(filePath, config.timeout);
        expect(fs.existsSync(filePath)).toBe(true);
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        let count = 0;
        for (let k = 0; k < input.chplProductNumbers.length; k += 1) {
          if (fileContents.includes(input.chplProductNumbers[k])) {
            count += 1;
          }
        }
        expect(count).toBe(input.chplProductNumbers.length);
      });
    });
  });

  describe('when searching for invalid CMS IDs', () => {
    const invalidCmsId = '000000AAAAAA111';
    beforeEach(() => {
      page.clear();
      page.search(invalidCmsId);
    });

    it('should show an error message', () => {
      expect(page.getInvalidText(invalidCmsId).getText()).toBe(`The CMS ID "${invalidCmsId}" is invalid, or not found`);
    });

    it('should not have the download results button', () => {
      expect(page.downloadResultsButton.isExisting()).toBe(false);
    });
  });
});
