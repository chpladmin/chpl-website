import CmsLookupPage from './cms-lookup.po';
import Hooks from '../../../utilities/hooks';

const path = require('path');
const fs = require('fs');
const inputs = require('./cms-lookup-dp');
const config = require('../../../config/mainConfig');

let cmsLookup;
let hooks;
const invalidCmsId = '000000AAAAAA';

beforeAll(async () => {
  cmsLookup = new CmsLookupPage();
  hooks = new Hooks();
  await hooks.open('#/resources/cms-lookup');
});

describe('On cms reverse look up page', () => {
  inputs.forEach((input) => {
    const { testName } = input;
    describe(`When searching for a CMS ID which was generated before for  ${testName}`, () => {
      beforeAll(() => {
        cmsLookup.searchField.clearValue();
        cmsLookup.searchField.addValue(input.cmsId);
        cmsLookup.searchIdButton.click();
        hooks.waitForSpinnerToDisappear();
      });

      it('should show correct listings for the CMS ID', () => {
        browser.waitUntil(() => $(cmsLookup.lookupResultsTable).isDisplayed());
        const ls = [];
        const { length } = cmsLookup.rowsLookupResultsTable;
        for (let j = 1; j <= length; j += 1) {
          ls.push(cmsLookup.chplProductNumberFromTable(j).getText());
        }
        expect(ls.toString()).toBe(input.chplProductNumbers.toString());
      });

      it('should have download results button and download file should contain correct listings Ids', () => {
        cmsLookup.downloadResultsButton.scrollAndClick();
        const fileName = `CMS_ID.${input.cmsId}.csv`;
        const filePath = path.join(global.downloadDir, fileName);
        if (!fs.existsSync(filePath)) {
          cmsLookup.downloadResultsButton.scrollAndClick();
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
        expect(count, input.chplProductNumbers.length).toBe('All chpl product numbers aren\'t present in the download file');
      });
    });
  });
});

describe('On cms reverse look up page', () => {
  describe('When searching for invalid CMS ID which doesnt exist', () => {
    beforeAll(() => {
      cmsLookup.searchField.clearValue();
      cmsLookup.searchField.addValue(invalidCmsId);
      cmsLookup.searchIdButton.click();
      hooks.waitForSpinnerToDisappear();
    });

    it('should show correct message', () => {
      expect(cmsLookup.certidLookupErrorText.getText()).toBe(`"${invalidCmsId}" is not a valid CMS EHR Certification ID format.`);
    });

    it('should not display look up results table', () => {
      expect(cmsLookup.lookupResultsTable.isExisting()).toBe(false);
    });

    it('should not have download results button', () => {
      expect(cmsLookup.downloadResultsButton.isExisting()).toBe(false);
    });
  });
});
