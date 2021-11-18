import CriteriaComponent from '../criteria.po';
import Hooks from '../../../../../utilities/hooks';
// import ListingPage from '../../../../../pages/listing/listing.po';

import CriterionComponent from './criterion.po';

let criteria;
let criterion;
let hooks;
// let page;

beforeEach(async () => {
  criteria = new CriteriaComponent();
  criterion = new CriterionComponent();
  // page = new ListingPage();
  hooks = new Hooks();
});

describe('the Criterion Component', () => {
  beforeEach(async () => {
    hooks.open('#/listing/9833');
    await hooks.waitForSpinnerToDisappear();

    //all criteria open
    //open the 'removed` if collapsed
    browser.saveScreenshot(`test_report/e2e/screenshot/${Date.now()}.png`);
  });

  it('should display criteria title correctly', () => {
    browser.waitUntil(() => criteria.criteriaCount() > 1);
    expect(criterion.criterionHeader('170.315 (a)(1)')).toBe('170.315 (a)(1): Computerized Provider Order Entry (CPOE) - Medications');
  });

  it('should display removed criteria title correctly', () => {
    browser.waitUntil(() => criteria.criteriaCount() > 1);
    expect(criterion.criterionHeader('170.315 (a)(10)')).toContain('Removed | 170.315 (a)(10): Drug-Formulary and Preferred Drug List Checks');
  });
});
