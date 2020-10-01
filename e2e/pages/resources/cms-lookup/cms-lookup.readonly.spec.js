import CmsLookupPage from './cms-lookup.po';
import CmsWidgetComponent from '../../../components/cms-widget/cms-widget.po';
import SearchPage from '../../../pages/search/search.po';
import Hooks from '../../../utilities/hooks';

const config = require('../../../config/mainConfig');
const path = require('path');
const fs = require('fs');

let cms,cmsLookup, hooks,search;
let listingId1 = 9851;
let listingId2 = 9879;
let search1 = '2621';//using developer code to search listing
let search2 = '2155';//using developer code to search listing
let fullListingId1 = '15.04.04.2621.iMed.51.00.1.181229';
let fullListingId2 = '15.04.04.2155.Pers.32.01.1.181231';
let cmsId;

beforeAll(async () => {
    cms = new CmsWidgetComponent();
    search = new SearchPage();
    cmsLookup = new CmsLookupPage();
    hooks = new Hooks();
});

describe('On cms reverse look up page', () => {
    describe('When searching for a CMS ID which was generated before', () => {
        beforeAll( () => {
            //creating cms id first as they are different cms ids between different environments
            hooks.open('#/search');
            search.searchForListing(search1);
            cms.addListingToCms(listingId1);
            search.searchForListing(search2);
            cms.addListingToCms(listingId2);
            hooks.waitForSpinnerToDisappear();
            cms.waitForProcessingSpinnerToDisappear();
            cms.getCertIdButton.click();
            cms.waitForProcessingSpinnerToDisappear();
            cmsId = cms.cmsCertificationIdText.getText();
            cms.cmsWidget.click();
            //Search for generated cmsid
            hooks.open('#/resources/cms-lookup');
            cmsLookup.searchField.addValue(cmsId);
            cmsLookup.searchIdButton.click();
            hooks.waitForSpinnerToDisappear();
        });

        it('should show correct listings for the CMS ID', () => {
            var ls = [];
            for ( var i = 1; i <= 2; i++ ) {
                ls.push($('//*[@id="lookupCertIdResults"]/tbody/tr[' + i + ']/td[6]').getText());
            }
            //Assertion to check listing IDs present
            assert.equal(ls.toString(),fullListingId1 + ',' + fullListingId2);
        });

        it('should have download results button', () => {
            cmsLookup.downloadResultsButton.scrollAndClick();
            const fileName = 'CMS_ID.' + cmsId + '.csv';
            const filePath = path.join(global.downloadDir, fileName);
            browser.waitForFileExists(filePath,config.timeout);
            assert.isTrue(fs.existsSync(filePath));
            //Reading file contents
            const fileContents = fs.readFileSync(filePath, 'utf-8');
            //Assertion to check if file has listing Ids
            assert.isTrue(fileContents.includes(fullListingId1));
            assert.isTrue(fileContents.includes(fullListingId2));
        });
    });
});
