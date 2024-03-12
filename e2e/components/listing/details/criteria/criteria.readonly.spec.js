import { open as openPage } from '../../../../utilities/hooks.async';
import ListingPage from '../../../../pages/listing/listing.po';

import CriteriaComponent from './criteria.po';

let criteria;
let page;

beforeEach(async () => {
  criteria = new CriteriaComponent();
  page = new ListingPage();
});

describe('the 2015 listing page', () => {
  beforeEach(async () => {
    await openPage('#/listing/9833');
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
    await expect(await (await criteria.criteriaDetails('1')).isDisplayed()).toBe(true);
  });
});

describe('the 2014 listing page', () => {
  beforeEach(async () => {
    await openPage('#/listing/8490');
    await browser.waitUntil(async () => (await page.productHistory).isDisplayed());
    await page.criteriaLeftNavButton();
  });

  it('should display attested criteria by default', async () => {
    await browser.waitUntil(async () => (await criteria.criteriaCount()) > 1);
    await expect(await criteria.criteriaCount()).toBeGreaterThan(35);
  });

  it('should display view only a1 criteria details', async () => {
    await criteria.expandCriteria('61');
    await browser.waitUntil(async () => (await criteria.criteriaDetails('61')).isDisplayed());
    await expect(await (await criteria.criteriaDetails('61')).isDisplayed()).toBe(true);
  });
});
