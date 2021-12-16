import CriteriaComponent from '../criteria.po';
import Hooks from '../../../../../utilities/hooks';

import CriterionComponent from './criterion.po';

let criteria;
let criterion;
let hooks;

beforeEach(async () => {
  criteria = new CriteriaComponent();
  criterion = new CriterionComponent();
  hooks = new Hooks();
});

describe('the Criterion Component', () => {
  beforeEach(() => {
    hooks.open('#/listing/9833');
    hooks.waitForSpinnerToDisappear();
    if (criterion.isUiUpgradeFlagOn()) {
      criteria.expandRemovedCriteria();
    }
    browser.waitUntil(() => criteria.criteriaCount() > 1);
  });

  it('should display criteria title correctly', () => {
    const header = criterion.criterionHeader('170.315 (a)(1)', 1);
    expect(header.getText()).toContain('170.315 (a)(1)');
    expect(header.getText().toUpperCase()).not.toContain('REMOVED');
  });

  it('should display removed criteria title correctly', () => {
    const header = criterion.criterionHeader('170.315 (a)(6)', 6);
    expect(header.getText().toUpperCase()).toContain('REMOVED');
  });
});
