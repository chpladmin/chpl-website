import CriteriaComponent from '../criteria.po';
import ListingPage from '../../../../../pages/listing/listing.po';

import { open as openPage } from '../../../../../utilities/hooks.async';

let criteria;
let page;

beforeEach(async () => {
  criteria = new CriteriaComponent();
  page = new ListingPage(); 
});

describe('the Criterion Component', () => {
  beforeEach(async () => {
    await openPage('#/listing/9833');
    await page.criteriaLeftNavButton();
  });

  it('should display criteria title correctly', async () => {
    await expect(await (await criteria.criteriaHeader(1)).getText()).toContain('170.315 (a)(1)');
    await expect(await (await criteria.criteriaHeader(1)).getText()).not.toContain('Removed');
  });
});
