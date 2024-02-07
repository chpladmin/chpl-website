import Hooks from '../../../../utilities/hooks';
import ListingPage from '../../../../pages/listing/listing.po';

import CriteriaComponent from './criteria.po';

let criteria;
let page;
let hooks;

beforeEach(async () => {
  criteria = new CriteriaComponent();
  page = new ListingPage();
  hooks = new Hooks();
});

describe('the 2015 listing page', () => {
  beforeEach(async () => {
    await hooks.open('#/listing/9833');
    await hooks.waitForSpinnerToDisappear();
    await page.criteriaLeftNavButton();
  });

  it('should display attested criteria by default', async () => {
    await browser.waitUntil(async () => (await criteria.criteriaCount()) > 1);
    await expect(await criteria.criteriaCount()).toBeGreaterThan(35);
  });

  it('should display removed criteria header', async () => {
    await expect(await criteria.removedCriteriaHeader.isDisplayed()).toBe(true);
  });

  it('should display view only a1 criteria details', async () => {
    await criteria.expandCriteria('1');
    await hooks.waitForSpinnerToDisappear();
    await expect(await (await criteria.criteriaDetails('1')).isDisplayed()).toBe(true);
  });
});

describe('the 2014 listing page', () => {
  beforeEach(async () => {
    await hooks.open('#/listing/8490');
    await hooks.waitForSpinnerToDisappear();
    await page.criteriaLeftNavButton();
  });

  it('should display attested criteria by default', async () => {
    await browser.waitUntil(async () => (await criteria.criteriaCount()) > 1);
    await expect(await criteria.criteriaCount()).toBeGreaterThan(35);
  });

  it('should display view only a1 criteria details', async () => {
    await criteria.expandCriteria('61');
    await hooks.waitForSpinnerToDisappear();
    await expect(await (await criteria.criteriaDetails('61')).isDisplayed()).toBe(true);
  });
});
