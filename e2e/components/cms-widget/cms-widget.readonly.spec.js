import SearchPage from '../../pages/collections/search/search.po'
import Hooks from '../../utilities/hooks';

import CmsWidgetComponent from './cms-widget.po';

const listingId1 = 9851;
const listingId2 = 11149;
const search1 = '2621'; // developer code for listingId1
const search2 = '2155'; // developer code for listingId2
const chplPublicGuide = 'https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf';
const cmsReverseLookup = '#/resources/cms-lookup';
const baseCriteria = 'http://healthit.gov/topic/certification-ehrs/2015-edition-test-method/2015-edition-cures-update-base-electronic-health-record-definition';

const config = require('../../config/mainConfig');

let cms;
let hooks;
let search;

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
      expect(cms.widgetText.map((p) => p.getText())).toEqual([
        'No products selected.',
        'Note: the selected products must meet 100% of the Base Criteria. For assistance, view the CHPL Public User Guide or Base Criteria.',
        'To view which products were used to create a specific CMS ID, use the CMS ID Reverse Lookup.',
      ]);
    });

    it('should have correct link to CHPL public guide', () => {
      expect(cms.chplPublicUserGuideLink.getAttribute('href')).toBe(chplPublicGuide);
    });

    it('should have correct link to CMS ID Reverse Lookup', () => {
      expect(cms.cmsIdReverseLookupLink.getAttribute('href')).toBe(cmsReverseLookup);
    });

    it('should not have progress bar', () => {
      expect(cms.progressBar.isDisplayed()).toBeFalse();
    });

    it('should have base criteria link', () => {
      expect(cms.baseCriteriaLink.isDisplayed()).toBeTrue();
    });

    it('should not have missing base criteria list', () => {
      expect(cms.missingBaseCriteriaListOr.isDisplayed()).toBeFalse();
      expect(cms.missingBaseCriteriaListAnd.isDisplayed()).toBeFalse();
    });
  });

  describe('if a listing added meet 80% of base criteria (View with partial products selected) - ', () => {
    beforeAll(() => {
      search.open();
      search.searchForText(search1);
      cms.addListingToCms(listingId1);
      cms.waitForProcessingSpinnerToDisappear();
    });

    it('should have progress bar with correct text and value', () => {
      expect(cms.progressBarText.getText()).toBe('80% Base Criteria Met');
      expect(cms.progressBarValue.getAttribute('aria-valuenow')).toBe('80');
    });

    it('should have missing base criteria list', () => {
      expect(cms.missingBaseCriteriaListOr.isDisplayed()).toBeTrue();
      expect(cms.missingBaseCriteriaListAnd.isDisplayed()).toBeTrue();
    });

    it('should have correct link to CHPL public guide', () => {
      expect(cms.chplPublicUserGuideLink.getAttribute('href')).toBe(chplPublicGuide);
    });

    it('should have get cert Id button and disabled', () => {
      expect(cms.getCertIdButton.isDisplayed()).toBeTrue();
      expect(cms.getCertIdButton.isClickable()).toBeFalse();
    });

    it('should have correct base criteria link', () => {
      expect(cms.baseCriteriaLink.isDisplayed()).toBeTrue();
      expect(cms.baseCriteriaLink.getAttribute('href')).toBe(baseCriteria);
    });

    it('should have correct CMS ID reverse look up link', () => {
      expect(cms.cmsIdReverseLookupLink.isDisplayed()).toBeTrue();
      expect(cms.cmsIdReverseLookupLink.getAttribute('href')).toBe(cmsReverseLookup);
    });

    it('should have a disabled compare products button', () => {
      expect(cms.compareProductsButton.isDisplayed()).toBeTrue();
      expect(cms.compareProductsButton.isEnabled()).toBeFalse();
    });

    it('should have remove all products button and enabled', () => {
      expect(cms.removeProductsButton.isDisplayed()).toBeTrue();
      expect(cms.removeProductsButton.isClickable()).toBeTrue();
    });

    it('remove products button should remove products from widget', () => {
      cms.removeProductsButton.click();
      expect(cms.removeProductsButton.isDisplayed()).toBeFalse();
    });
  });

  describe('if there are listings added which meets 100% of base criteria(View with 100% products) - ', () => {
    beforeAll(() => {
      search.open();
      search.searchForText(search1);
      cms.addListingToCms(listingId1);
      search.searchForText(search2);
      browser.waitUntil(() => cms.certIdButton(listingId2), config.shortTimeout);
      cms.addListingToCms(listingId2);
      cms.waitForProcessingSpinnerToDisappear();
    });

    it('should have progress bar with the right text and value', () => {
      expect(cms.progressBarText.getText()).toBe('100% Base Criteria Met');
      expect(cms.progressBarValue.getAttribute('aria-valuenow')).toBe('100');
    });

    it('should not have missing base criteria list', () => {
      expect(cms.missingBaseCriteriaListOr.isDisplayed()).toBeFalse();
      expect(cms.missingBaseCriteriaListAnd.isDisplayed()).toBeFalse();
    });

    it('should have correct CMS ID reverse look up link', () => {
      expect(cms.cmsIdReverseLookupLink.isDisplayed()).toBeTrue();
      expect(cms.cmsIdReverseLookupLink.getAttribute('href')).toBe(cmsReverseLookup);
    });

    it('should not have a base criteria link', () => {
      expect(cms.baseCriteriaLink.isDisplayed()).toBeFalse();
    });

    it('should not have link to CHPL public guide', () => {
      expect(cms.chplPublicUserGuideLink.isDisplayed()).toBeFalse();
    });

    it('should have remove all products button and enabled', () => {
      expect(cms.removeProductsButton.isDisplayed()).toBeTrue();
      expect(cms.removeProductsButton.isClickable()).toBeTrue();
    });

    it('should have get cert Id button and enabled', () => {
      expect(cms.getCertIdButton.isDisplayed()).toBeTrue();
      expect(cms.getCertIdButton.isClickable()).toBeTrue();
    });

    it('get cert ID button generates CMS ID for the listings added', () => {
      cms.getCertIdButton.click();
      cms.waitForProcessingSpinnerToDisappear();
      expect(cms.cmsCertificationIdText.isDisplayed()).toBeTrue();
    });

    it('should have compare products button', () => {
      expect(cms.compareProductsButton.isDisplayed()).toBeTrue();
    });

    it('compare products button should open compare widget', () => {
      cms.compareProductsButton.click();
      expect(cms.compareWidgetDropdown.isDisplayed()).toBeTrue();
    });
  });
});
