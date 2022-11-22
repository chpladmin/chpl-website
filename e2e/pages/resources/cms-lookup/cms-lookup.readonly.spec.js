import CmsLookupPage from './cms-lookup.po';
import Hooks from '../../../utilities/hooks';

const path = require('path');
const fs = require('fs');
const inputs = require('./cms-lookup-dp');
const config = require('../../../config/mainConfig');

let cmsLookup;
let hooks;

beforeAll(async () => {
  cmsLookup = new CmsLookupPage();
  hooks = new Hooks();
  await hooks.open('#/resources/cms-lookup');
});

describe('On cms reverse look up page', () => {
  inputs.forEach((input) => {
    const { testName } = input;
    describe(`When searching for a CMS ID which was generated before for ${testName}`, () => {
      beforeEach(() => {
        cmsLookup.clear();
        cmsLookup.search(input.cmsId);
      });

      it('should show correct listings for the CMS ID', () => {
        const listings = cmsLookup.getResults().map((row) => row.$$('td')[5].getText()).join(',');
        expect(listings).toBe(input.chplProductNumbers.toString());
      });

      it('should have download results button and download file should contain correct listings Ids', () => {
        cmsLookup.downloadResultsButton.click();
        const fileName = `CMS_ID.${input.cmsId}.csv`;
        const filePath = path.join(global.downloadDir, fileName);
        if (!fs.existsSync(filePath)) {
          cmsLookup.downloadResultsButton.click();
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
});

describe('On cms reverse look up page', () => {
  describe('When searching for invalid CMS ID which doesnt exist', () => {
    const invalidCmsId = '000000AAAAAA111';
    beforeEach(() => {
      cmsLookup.clear();
      cmsLookup.search(invalidCmsId);
    });

    it('should show correct message', () => {
      expect(cmsLookup.getInvalidText(invalidCmsId).getText()).toBe(`The CMS ID "${invalidCmsId}" is invalid, or not found`);
    });

    it('should not have download results button', () => {
      expect(cmsLookup.downloadResultsButton.isExisting()).toBe(false);
    });
  });
});
