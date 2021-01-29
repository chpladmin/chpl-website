import CmsLookupPage from './cms-lookup.po';
import Hooks from '../../../utilities/hooks';

const inputs = require('./cms-lookup-dp');
const config = require('../../../config/mainConfig');
const path = require('path');
const fs = require('fs');

let cmsLookup, hooks;
const invalidCmsId = '000000AAAAAA';

beforeEach(async () => {
    cmsLookup = new CmsLookupPage();
    hooks = new Hooks();
    await hooks.open('#/resources/cms-lookup');
});

describe('On cms reverse look up page', () => {
    inputs.forEach(input => {
        let testName = input.testName;
        describe(`When searching for a CMS ID which was generated before for  ${testName}`, () => {
            beforeEach( () => {
                cmsLookup.searchField.clearValue();
                cmsLookup.searchField.addValue(input.cmsId);
                cmsLookup.searchIdButton.click();
                hooks.waitForSpinnerToDisappear();
            });

            it('should show correct listings for the CMS ID', () => {
                browser.waitUntil( () => $(cmsLookup.lookupResultsTable).isDisplayed());
                var ls = [];
                var length = cmsLookup.rowsLookupResultsTable.length;
                for ( var j = 1; j <= length; j++ ) {
                    ls.push(cmsLookup.chplProductNumberFromTable(j).getText());
                }
                assert.equal(ls.toString(),input.chplProductNumbers.toString());
            });

            it('should have download results button and download file should contain correct listings Ids', () => {
                cmsLookup.downloadResultsButton.scrollAndClick();
                const fileName = 'CMS_ID.' + input.cmsId + '.csv';
                const filePath = path.join(global.downloadDir, fileName);
                if (!fs.existsSync(filePath)) {
                    cmsLookup.downloadResultsButton.scrollAndClick();
                }
                browser.waitForFileExists(filePath,config.timeout);
                assert.isTrue(fs.existsSync(filePath));
                const fileContents = fs.readFileSync(filePath, 'utf-8');
                var count = 0;
                for ( var k = 0; k < input.chplProductNumbers.length; k ++) {
                    if (fileContents.includes(input.chplProductNumbers[k])) {
                        count ++;
                    }
                }
                assert.equal(count,input.chplProductNumbers.length, 'All chpl product numbers aren\'t present in the download file');
            });
        });
    });
});

describe('On cms reverse look up page', () => {
    describe('When searching for invalid CMS ID which doesnt exist', () => {
        beforeEach( () => {
            cmsLookup.searchField.clearValue();
            cmsLookup.searchField.addValue(invalidCmsId);
            cmsLookup.searchIdButton.click();
            hooks.waitForSpinnerToDisappear();
        });

        it('should show correct message', () => {
            assert.equal(cmsLookup.certidLookupErrorText.getText(),'"' + invalidCmsId + '" is not a valid CMS EHR Certification ID format.');
        });

        it('should not display look up results table', () => {
            assert.isFalse(cmsLookup.lookupResultsTable.isExisting());
        });

        it('should not have download results button', () => {
            assert.isFalse(cmsLookup.downloadResultsButton.isExisting());
        });
    });
});

