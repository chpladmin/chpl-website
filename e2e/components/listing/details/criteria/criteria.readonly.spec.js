import Hooks from '../../../../utilities/hooks';

import CriteriaComponent from './criteria.po';

let criteria;
let hooks;

beforeEach(async () => {
  criteria = new CriteriaComponent();
  hooks = new Hooks();
});

describe('the 2015 listing page', () => {
  beforeEach(async () => {
    hooks.open('#/listing/9833');
    await hooks.waitForSpinnerToDisappear();
  });

  it('should display attested criteria by default', () => {
    browser.waitUntil(() => criteria.criteriaCount() > 1);
    expect(criteria.criteriaCount()).toBeGreaterThan(35);
  });

  it.skip('should display removed criteria header', () => {
    expect(criteria.removedCriteriaHeader.isDisplayed()).toBe(true);
  });

  it('should display view only a1 criteria details', () => {
    criteria.expandCriteria('1');
    expect(criteria.criteriaDetailTable('1').isDisplayed()).toBe(true);
  });

  it('should display view only removed a6 criteria details', () => {
    criteria.expandRemovedCriteria();
    criteria.expandCriteria('6');
    expect(criteria.criteriaDetailTable('6').isDisplayed()).toBe(true);
  });
});

describe('the 2014 listing page', () => {
  beforeEach(async () => {
    hooks.open('#/listing/8490');
    await hooks.waitForSpinnerToDisappear();
  });

  it('should display attested criteria by default', () => {
    browser.waitUntil(() => criteria.criteriaCount() > 1);
    expect(criteria.criteriaCount()).toBeGreaterThan(35);
  });

  it('should display view only a1 criteria details', () => {
    criteria.expandCriteria('61');
    expect(criteria.criteriaDetailTable('61').isDisplayed()).toBe(true);
  });
});
