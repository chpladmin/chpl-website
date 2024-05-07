import SearchPage from '../../pages/collections/search/search.po';
import { open as openPage } from '../../utilities/hooks';

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
      await expect(await Promise.all(cms.widgetText.map(async (p) => await p.getText()))).toEqual([
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
});
