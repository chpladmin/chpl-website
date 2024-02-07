import CriteriaComponent from '../criteria.po';
import Hooks from '../../../../../utilities/hooks';
import ListingPage from '../../../../../pages/listing/listing.po';

let criteria;
let hooks;
let page;

beforeEach(async () => {
  criteria = new CriteriaComponent();
  page = new ListingPage();
  hooks = new Hooks();
});

describe('the Criterion Component', () => {
  beforeEach(async () => {
    await hooks.open('#/listing/9833');
    await hooks.waitForSpinnerToDisappear();
    await page.criteriaLeftNavButton();
  });

  it('should display criteria title correctly', async () => {
    await expect(await (await criteria.criteriaHeader(1)).getText()).toContain('170.315 (a)(1)');
    await expect(await (await criteria.criteriaHeader(1)).getText()).not.toContain('Removed');
  });
});
