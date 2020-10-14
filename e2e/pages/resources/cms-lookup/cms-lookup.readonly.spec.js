import CmsLookupPage from './cms-lookup.po';
import Hooks from '../../../utilities/hooks';

const inputs = require('./cms-lookup-dp');
const config = require('../../../config/mainConfig');
const path = require('path');
const fs = require('fs');

let cmsLookup, hooks;
const invalidCmsId = '000000AAAAAA';

beforeAll(async () => {
    cmsLookup = new CmsLookupPage();
    hooks = new Hooks();
    await hooks.open('#/resources/cms-lookup');
});

describe('On cms reverse look up page', () => {
    for (const i in inputs) {
        let testName = inputs[i].testName;
        describe(`When searching for a CMS ID which was generated before for  ${testName}`, () => {
            beforeAll( () => {
                cmsLookup.searchField.clearValue();
                cmsLookup.searchField.addValue(inputs[i].cmsId);
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
                assert.equal(ls.toString(),inputs[i].chplProductNumbers.toString());
            });

            it('should have download results button and download file should contain correct listings Ids', () => {
                cmsLookup.downloadResultsButton.scrollAndClick();
                const fileName = 'CMS_ID.' + inputs[i].cmsId + '.csv';
                const filePath = path.join(global.downloadDir, fileName);
                browser.waitForFileExists(filePath,config.timeout);
                assert.isTrue(fs.existsSync(filePath));
                const fileContents = fs.readFileSync(filePath, 'utf-8');
                var isInclude = 0;
                for ( var k = 0; k < inputs[i].chplProductNumbers.length; k ++) {
                    if (fileContents.includes(inputs[i].chplProductNumbers[k])) {
                        isInclude ++;
                    }
                }
                assert.equal(isInclude,inputs[i].chplProductNumbers.length, 'All chpl product numbers arent present in the download file');
            });
        });
    }
});

describe('On cms reverse look up page', () => {
    describe('When searching for invalid CMS ID which doesnt exist', () => {
        beforeAll( () => {
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

