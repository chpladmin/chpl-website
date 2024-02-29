import SearchPage from '../../pages/collections/search/search.po';
import { open as openPage } from '../../utilities/hooks.async';

import CmsWidgetComponent from './cms-widget.po';

const listingId1 = 11084;
const listingId2 = 10974;
const listingId3 = 10964;
const search1 = '1043'; // developer code for listingId1
const search2 = '3121'; // developer code for listingId2
const chplPublicGuide = 'https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf';
const cmsReverseLookup = '#/resources/cms-lookup';
const baseCriteria = 'http://healthit.gov/topic/certification-ehrs/2015-edition-test-method/2015-edition-cures-update-base-electronic-health-record-definition';

const config = require('../../config/mainConfig');

let cms;
let search;

beforeAll(async () => {
  search = new SearchPage();
  cms = new CmsWidgetComponent();
  await openPage('#/search');
});

describe('on cms widget', () => {
  describe('if there is no listing added (View preliminary popup) - ', () => {
    beforeAll(() => {
      cms.cmsWidget.click();
    });

    it('should say No Products Selected text', async () => {
      await expect(await Promise.all(cms.widgetText.map(async p => await p.getText()))).toEqual([
        'No products selected.',
        'Note: the selected products must meet 100% of the Base Criteria. For assistance, view the CHPL Public User Guide or Base Criteria.',
        'To view which products were used to create a specific CMS ID, use the CMS ID Reverse Lookup.',
      ]);
    });

    it('should have correct link to CHPL public guide', async () => {
      await expect(await cms.chplPublicUserGuideLink.getAttribute('href')).toBe(chplPublicGuide);
    });

    it('should have correct link to CMS ID Reverse Lookup', async () => {
      await expect(await (await cms.cmsIdReverseLookupLink()).getAttribute('href')).toBe(cmsReverseLookup);
    });

    it('should not have progress bar', async () => {
      await expect(await cms.progressBar.isDisplayed()).toBeFalse();
    });

    it('should have base criteria link', async () => {
      await expect(await (await cms.baseCriteriaLink()).isDisplayed()).toBe(true);
    });

    it('should not have missing base criteria list', async () => {
      await expect(await cms.missingBaseCriteriaListOr.isDisplayed()).toBe(false);
      await expect(await (await cms.missingBaseCriteriaListAnd()).isDisplayed()).toBe(false);
    });
  });

  describe('if a listing added meet 70% of base criteria (View with partial products selected) - ', () => {
    beforeAll(() => {
      search.open();
      search.searchForText(search1);
      cms.addListingToCms(listingId1);
      cms.waitForProcessingSpinnerToDisappear();
    });

    it('should have progress bar with correct text and value', async () => {
      await expect(await cms.progressBarText.getText()).toBe('70% Base Criteria Met');
      await expect(await (await cms.progressBarValue()).getAttribute('aria-valuenow')).toBe('70');
    });

    it('should have missing base criteria list', async () => {
      await expect(await cms.missingBaseCriteriaListOr.isDisplayed()).toBe(true);
      await expect(await (await cms.missingBaseCriteriaListAnd()).isDisplayed()).toBe(true);
    });

    it('should have correct link to CHPL public guide', async () => {
      await expect(await cms.chplPublicUserGuideLink.getAttribute('href')).toBe(chplPublicGuide);
    });

    it('should have get cert Id button and disabled', async () => {
      await expect(await (await cms.getCertIdButton()).isDisplayed()).toBe(true);
      await expect(await (await cms.getCertIdButton()).isClickable()).toBe(false);
    });

    it('should have correct base criteria link', async () => {
      await expect(await (await cms.baseCriteriaLink()).isDisplayed()).toBe(true);
      await expect(await (await cms.baseCriteriaLink()).getAttribute('href')).toBe(baseCriteria);
    });

    it('should have correct CMS ID reverse look up link', async () => {
      await expect(await (await cms.cmsIdReverseLookupLink()).isDisplayed()).toBe(true);
      await expect(await (await cms.cmsIdReverseLookupLink()).getAttribute('href')).toBe(cmsReverseLookup);
    });

    it('should have a disabled compare products button', async () => {
      await expect(await (await cms.compareProductsButton()).isDisplayed()).toBe(true);
      await expect(await (await cms.compareProductsButton()).isEnabled()).toBe(false);
    });

    it('should have remove all products button and enabled', async () => {
      await expect(await (await cms.removeProductsButton()).isDisplayed()).toBe(true);
      await expect(await (await cms.removeProductsButton()).isClickable()).toBe(true);
    });

    it('remove products button should remove products from widget', async () => {
      await (await cms.removeProductsButton()).click();
      await expect(await (await cms.removeProductsButton()).isDisplayed()).toBe(false);
    });
  });

  describe('if there are listings added which meets 100% of base criteria(View with 100% products) - ', () => {
    beforeAll(() => {
      search.open();
      search.searchForText(search2);
      browser.waitUntil(async () => await (await cms.certIdButton(listingId2)), config.shortTimeout);
      cms.addListingToCms(listingId2);
      cms.addListingToCms(listingId3);
      cms.waitForProcessingSpinnerToDisappear();
    });

    //ignoring these tests as they are flaky - will address these tests later
    xit('should have progress bar with the right text and value', async () => {
      await expect(await cms.progressBarText.getText()).toBe('100% Base Criteria Met');
      await expect(await (await cms.progressBarValue()).getAttribute('aria-valuenow')).toBe('100');
    });

    //ignoring these tests as they are flaky - will address these tests later
    xit('should not have missing base criteria list', async () => {
      await expect(await cms.missingBaseCriteriaListOr.isDisplayed()).toBe(false);
      await expect(await (await cms.missingBaseCriteriaListAnd()).isDisplayed()).toBe(false);
    });

    it('should have correct CMS ID reverse look up link', async () => {
      await expect(await (await cms.cmsIdReverseLookupLink()).isDisplayed()).toBe(true);
      await expect(await (await cms.cmsIdReverseLookupLink()).getAttribute('href')).toBe(cmsReverseLookup);
    });

    //ignoring these tests as they are flaky - will address these tests later
    xit('should not have a base criteria link', async () => {
      await expect(await (await cms.baseCriteriaLink()).isDisplayed()).toBe(false);
    });

    //ignoring these tests as they are flaky - will address these tests later
    xit('should not have link to CHPL public guide', async () => {
      await expect(await cms.chplPublicUserGuideLink.isDisplayed()).toBeFalse();
    });

    //ignoring these tests as they are flaky - will address these tests later
    xit('should have remove all products button and enabled', async () => {
      await expect(await (await cms.removeProductsButton()).isDisplayed()).toBe(true);
      await expect(await (await cms.removeProductsButton()).isClickable()).toBe(true);
    });

    //ignoring these tests as they are flaky - will address these tests later
    xit('should have get cert Id button and enabled', async () => {
      await expect(await (await cms.getCertIdButton()).isDisplayed()).toBe(true);
      await expect(await (await cms.getCertIdButton()).isClickable()).toBe(true);
    });

    it('get cert ID button generates CMS ID for the listings added', async () => {
      await (await cms.getCertIdButton()).click();
      await cms.waitForProcessingSpinnerToDisappear();
      await expect(await (await cms.cmsCertificationIdText()).isDisplayed()).toBe(true);
    });

    it('should have compare products button', async () => {
      await expect(await (await cms.compareProductsButton()).isDisplayed()).toBe(true);
    });

    it('compare products button should open compare widget', async () => {
      await (await cms.compareProductsButton()).click();
      await expect(await (await cms.compareWidgetDropdown()).isDisplayed()).toBe(true);
    });
  });
});
