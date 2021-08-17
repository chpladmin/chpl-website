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
      expect(cms.noProductsSelectedText.getText()).toBe('No products selected.');
    });

    it('should have correct link to CHPL public guide', () => {
      expect(cms.chplPublicUserGuideLink.getAttribute('href')).toBe(chplPublicGuide);
    });

    it('should have correct link to CMS ID Reverse Lookup', () => {
      expect(cms.cmsIdReverseLookupLink.getAttribute('href')).toBe(cmsReverseLookup);
    });

    it('should not have progress bar', () => {
      expect(cms.progressBar.isDisplayed()).toBeFalse;
    });

    it('should not have base criteria link', () => {
      expect(cms.baseCriteriaLink.isDisplayed()).toBeFalse;
    });

    it('should not have missing base criteria list', () => {
      expect(cms.missingBaseCriteriaListOr.isDisplayed()).toBeFalse;
      expect(cms.missingBaseCriteriaListAnd.isDisplayed()).toBeFalse;
    });

  });

  describe('if a listing added meet 80% of base criteria (View with partial products selected) - ', () => {
    beforeAll(() => {
      search.searchForListing(search1);
      browser.waitUntil(() => search.getColumnText(1,6).includes(search1));
      cms.addListingToCms(listingId1);
      hooks.waitForSpinnerToDisappear();
      cms.waitForProcessingSpinnerToDisappear();
    });

    it('should have progress bar of blue color and say 80 % of the base criteria met', () => {
      expect(cms.progressBar.getText()).toBe('80% Base Criteria Met');
      expect(cms.progressBar.getCSSProperty('background-color')['parsed']['hex']).toBe('#156dac');
    });

    it('should have missing base criteria list', () => {
      expect(cms.missingBaseCriteriaListOr.isDisplayed()).toBeTrue;
      expect(cms.missingBaseCriteriaListAnd.isDisplayed()).toBeTrue;
    });

    it('should have correct link to CHPL public guide', () => {
      expect(cms.chplPublicUserGuideLink.getAttribute('href')).toBe(chplPublicGuide);
    });

    it('should have get cert Id button and disabled', () => {
      expect(cms.getCertIdButton.isDisplayed()).toBeTrue;
      expect(cms.getCertIdButton.isClickable()).toBeFalse;
    });

    it('should have correct base criteria link', () => {
      expect(cms.baseCriteriaLink.isDisplayed()).toBeTrue;
      expect(cms.baseCriteriaLink.getAttribute('href')).toBe(baseCriteria);
    });

    it('should have correct CMS ID reverse look up link', () => {
      expect(cms.cmsIdReverseLookupLink.isDisplayed()).toBeTrue;
      expect(cms.cmsIdReverseLookupLink.getAttribute('href')).toBe(cmsReverseLookup);
    });

    it('should not have compare products button', () => {
      expect(cms.compareProductsButton.isDisplayed()).toBeFalse;
    });

    it('should have remove all products button and enabled', () => {
      expect(cms.removeProductsButton.isDisplayed()).toBeTrue;
      expect(cms.removeProductsButton.isClickable()).toBeTrue;
    });

    it('remove products button should remove products from widget', () => {
      cms.removeProductsButton.click();
      expect(cms.removeProductsButton.isDisplayed()).toBeFalse;
    });
  });

  describe('if there are listings added which meets 100% of base criteria(View with 100% products) - ', () => {
    beforeAll(() => {
      search.searchForListing(search1);
      browser.waitUntil(() => search.getColumnText(1,6).includes(search1));
      cms.addListingToCms(listingId1);
      search.searchForListing(search2);
      browser.waitUntil(() => search.getColumnText(1,6).includes(search2));
      cms.addListingToCms(listingId2);
      hooks.waitForSpinnerToDisappear();
      cms.waitForProcessingSpinnerToDisappear();
    });

    it('should have progress bar of green color and say 100% of the base criteria met', () => {
      expect(cms.progressBar.getText()).toBe('100% Base Criteria Met');
      expect(cms.progressBar.getCSSProperty('background-color')['parsed']['hex']).toBe('#356635');
    });

    it('should not have missing base criteria list', () => {
      expect(cms.missingBaseCriteriaListOr.isDisplayed()).toBeFalse;
      expect(cms.missingBaseCriteriaListAnd.isDisplayed()).toBeFalse;
    });

    it('should have correct CMS ID reverse look up link', () => {
      expect(cms.cmsIdReverseLookupLink.isDisplayed()).toBeTrue;
      expect(cms.cmsIdReverseLookupLink.getAttribute('href')).toBe(cmsReverseLookup);
    });

    it('should have correct base criteria link', () => {
      expect(cms.baseCriteriaLink.isDisplayed()).toBeTrue;
      expect(cms.baseCriteriaLink.getAttribute('href')).toBe(baseCriteria);
    });

    it('should not have link to CHPL public guide', () => {
      expect(cms.chplPublicUserGuideLink.isDisplayed()).toBeFalse;
    });

    it('should have remove all products button and enabled', () => {
      expect(cms.removeProductsButton.isDisplayed()).toBeTrue;
      expect(cms.removeProductsButton.isClickable()).toBeTrue;
    });

    it('should have get cert Id button and enabled', () => {
      expect(cms.getCertIdButton.isDisplayed()).toBeTrue;
      expect(cms.getCertIdButton.isClickable()).toBeTrue;
    });

    it('get cert ID button generates CMS ID for the listings added', () => {
      cms.getCertIdButton.click();
      hooks.waitForSpinnerToDisappear();
      cms.waitForProcessingSpinnerToDisappear();
      expect(cms.cmsCertificationIdText.isDisplayed()).toBeTrue;
      cmsId = cms.cmsCertificationIdText.getText();
    });

    it('PDF is downloaded after generating CMS ID', () => {
      cms.downloadPdfButton.click();
      const fileName = cmsId + '.pdf';
      const filePath = path.join(global.downloadDir, fileName);
      browser.waitForFileExists(filePath,config.timeout);
      expect(fs.existsSync(filePath)).toBeTrue;
    });

    it('should have compare products button', () => {
      expect(cms.compareProductsButton.isDisplayed()).toBeTrue;
    });

    it('compare products button should open compare widget', () => {
      cms.compareProductsButton.click();
      expect(cms.compareWidgetDropdown.isDisplayed()).toBeTrue;
    });
  });
});
