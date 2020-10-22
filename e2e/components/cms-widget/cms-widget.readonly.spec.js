import CmsWidgetComponent from './cms-widget.po';
import SearchPage from '../../pages/search/search.po';
import Hooks from '../../utilities/hooks';

const config = require('../../config/mainConfig');
const path = require('path');
const fs = require('fs');

let cms, hooks, search;
let listingId1 = 9851;
let listingId2 = 9879;
let search1 = '2621';//using developer code to search listing
let search2 = '2155';//using developer code to search listing
let cmsId;
const chplPublicGuide = 'https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf';
const cmsReverseLookup = '#/resources/cms-lookup';
const baseCriteria = 'http://healthit.gov/topic/certification-ehrs/2015-edition-test-method/2015-edition-cures-update-base-electronic-health-record-definition';

beforeAll(async () => {
    search = new SearchPage();
    cms = new CmsWidgetComponent();
    hooks = new Hooks();
    await hooks.open('#/search');
});

describe('on cms widget', () => {
    describe('if there is no listing added (View preliminary popup) - ', () => {
        beforeAll(() => {
            cms.cmsWidget.click();
        });

        it('should say No Products Selected text', () => {
            assert.equal(cms.noProductsSelectedText.getText(),'No products selected.');
        });

        it('should have correct link to CHPL public guide', () => {
            assert.equal(cms.chplPublicUserGuideLink.getAttribute('href'),chplPublicGuide);
        });

        it('should have correct link to CMS ID Reverse Lookup', () => {
            assert.equal(cms.cmsIdReverseLookupLink.getAttribute('href').slice(cms.cmsIdReverseLookupLink.getAttribute('href').length - 22),cmsReverseLookup);
        });

        it('should not have progress bar', () => {
            assert.isFalse(cms.progressBar.isDisplayed());
        });

        it('should not have base criteria link', () => {
            assert.isFalse(cms.baseCriteriaLink.isDisplayed());
        });

        it('should not have missing base criteria list', () => {
            assert.isFalse(cms.missingBaseCriteriaListOr.isDisplayed());
            assert.isFalse(cms.missingBaseCriteriaListAnd.isDisplayed());
        });

    });

    describe('if a listing added meet 80% of base criteria (View with partial products selected) - ', () => {
        beforeAll(() => {
            search.searchForListing(search1);
            cms.addListingToCms(listingId1);
            hooks.waitForSpinnerToDisappear();
            cms.waitForProcessingSpinnerToDisappear();
        });

        it('should have progress bar of blue color and say 80 % of the base criteria met', () => {
            assert.equal(cms.progressBar.getText(),'80% Base Criteria Met');
            assert.equal(cms.progressBar.getCSSProperty('background-color')['parsed']['hex'],'#156dac');
        });

        it('should have missing base criteria list', () => {
            assert.isTrue(cms.missingBaseCriteriaListOr.isDisplayed());
            assert.isTrue(cms.missingBaseCriteriaListAnd.isDisplayed());
        });

        it('should have correct link to CHPL public guide', () => {
            assert.equal(cms.chplPublicUserGuideLink.getAttribute('href'),chplPublicGuide);
        });

        it('should have get cert Id button and disabled', () => {
            assert.isTrue(cms.getCertIdButton.isDisplayed());
            assert.isFalse(cms.getCertIdButton.isClickable());
        });

        it('should have correct base criteria link', () => {
            assert.isTrue(cms.baseCriteriaLink.isDisplayed());
            assert.equal(cms.baseCriteriaLink.getAttribute('href'),baseCriteria);
        });

        it('should have correct CMS ID reverse look up link', () => {
            assert.isTrue(cms.cmsIdReverseLookupLink.isDisplayed());
            assert.equal(cms.cmsIdReverseLookupLink.getAttribute('href').slice(cms.cmsIdReverseLookupLink.getAttribute('href').length - 22),cmsReverseLookup);
        });

        it('should not have compare products button', () => {
            assert.isFalse(cms.compareProductsButton.isDisplayed());
        });

        it('should have remove all products button and enabled', () => {
            assert.isTrue(cms.removeProductsButton.isDisplayed());
            assert.isTrue(cms.removeProductsButton.isClickable());
        });

        it('remove products button should remove products from widget', () => {
            cms.removeProductsButton.click();
            assert.isFalse(cms.removeProductsButton.isDisplayed());
        });
    });

    describe('if there are listings added which meets 100% of base criteria(View with 100% products) - ', () => {
        beforeAll(() => {
            search.searchForListing(search1);
            cms.addListingToCms(listingId1);
            search.searchForListing(search2);
            cms.addListingToCms(listingId2);
            hooks.waitForSpinnerToDisappear();
            cms.waitForProcessingSpinnerToDisappear();
        });

        it('should have progress bar of green color and say 100% of the base criteria met', () => {
            assert.equal(cms.progressBar.getText(),'100% Base Criteria Met');
            assert.equal(cms.progressBar.getCSSProperty('background-color')['parsed']['hex'],'#356635');
        });

        it('should not have missing base criteria list', () => {
            assert.isFalse(cms.missingBaseCriteriaListOr.isDisplayed());
            assert.isFalse(cms.missingBaseCriteriaListAnd.isDisplayed());
        });

        it('should have correct CMS ID reverse look up link', () => {
            assert.isTrue(cms.cmsIdReverseLookupLink.isDisplayed());
            assert.equal(cms.cmsIdReverseLookupLink.getAttribute('href').slice(cms.cmsIdReverseLookupLink.getAttribute('href').length - 22),cmsReverseLookup);
        });

        it('should have correct base criteria link', () => {
            assert.isTrue(cms.baseCriteriaLink.isDisplayed());
            assert.equal(cms.baseCriteriaLink.getAttribute('href'),baseCriteria);
        });

        it('should not have link to CHPL public guide', () => {
            assert.isFalse(cms.chplPublicUserGuideLink.isDisplayed());
        });

        it('should have remove all products button and enabled', () => {
            assert.isTrue(cms.removeProductsButton.isDisplayed());
            assert.isTrue(cms.removeProductsButton.isClickable());
        });

        it('should have get cert Id button and enabled', () => {
            assert.isTrue(cms.getCertIdButton.isDisplayed());
            assert.isTrue(cms.getCertIdButton.isClickable());
        });

        it('get cert ID button generates CMS ID for the listings added', () => {
            cms.getCertIdButton.click();
            hooks.waitForSpinnerToDisappear();
            cms.waitForProcessingSpinnerToDisappear();
            assert.isTrue(cms.cmsCertificationIdText.isDisplayed());
            cmsId = cms.cmsCertificationIdText.getText();
        });

        it('PDF is downloaded after generating CMS ID', () => {
            cms.downloadPdfButton.click();
            const fileName = cmsId + '.pdf';
            const filePath = path.join(global.downloadDir, fileName);
            browser.waitForFileExists(filePath,config.timeout);
            assert.isTrue(fs.existsSync(filePath));
        });

        it('should have compare products button', () => {
            assert.isTrue(cms.compareProductsButton.isDisplayed());
        });

        it('compare products button should open compare widget', () => {
            cms.compareProductsButton.click();
            assert.isTrue(cms.compareWidgetDropdown.isDisplayed());
        });
    });
});
