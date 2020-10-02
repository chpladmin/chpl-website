import CmsLookupPage from './cms-lookup.po';
import Hooks from '../../../utilities/hooks';

const config = require('../../../config/mainConfig');
const path = require('path');
const fs = require('fs');

let cmsLookup, hooks;
var listingIds = ['15.07.07.1447.BE02.01.00.1.160815','15.07.07.1447.BE01.02.01.1.161014','15.07.07.1447.EP03.02.03.1.161209','15.07.07.1447.EP03.03.04.1.170403'];
const cmsId = '0015EYE3ZT3QFP4';

beforeAll(async () => {
    cmsLookup = new CmsLookupPage();
    hooks = new Hooks();
    await hooks.open('#/resources/cms-lookup');
});

describe('On cms reverse look up page', () => {
    describe('When searching for a CMS ID which was generated before', () => {
        beforeAll( () => {
            cmsLookup.searchField.addValue(cmsId);
            cmsLookup.searchIdButton.click();
            hooks.waitForSpinnerToDisappear();
        });

        it('should show correct listings for the CMS ID', () => {
            var ls = [];
            for ( var i = 1; i <= 4; i++ ) {
                ls.push($('//*[@id="lookupCertIdResults"]/tbody/tr[' + i + ']/td[6]').getText());
            }
            assert.equal(ls.toString(),listingIds.toString());
        });

        it('should have download results button and download file should contain correct listings Ids', () => {
            cmsLookup.downloadResultsButton.scrollAndClick();
            const fileName = 'CMS_ID.' + cmsId + '.csv';
            const filePath = path.join(global.downloadDir, fileName);
            browser.waitForFileExists(filePath,config.timeout);
            assert.isTrue(fs.existsSync(filePath));
            const fileContents = fs.readFileSync(filePath, 'utf-8');
            var isInclude = false;
            for ( var k = 0; k < listingIds.length; k ++) {
                if (fileContents.includes(listingIds[k])) {
                    isInclude = true;
                }
            }
            assert.isTrue(isInclude);
        });
    });
});
