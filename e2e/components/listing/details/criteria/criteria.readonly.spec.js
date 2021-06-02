import CriteriaComponent from './criteria.po';
import Hooks from '../../../../utilities/hooks';
import ListingPage from '../../../../pages/listing/listing.po';

let criteria; let hooks; let
  page;

describe('the Listing page', () => {
  beforeEach(async () => {
    criteria = new CriteriaComponent();
    page = new ListingPage();
    hooks = new Hooks();
    hooks.open('#/listing/9833');
    await hooks.waitForSpinnerToDisappear();
  });

  it('should display attested criteria by default', () => {
    browser.waitUntil(() => criteria.criteriaCount() > 1);
    expect(criteria.criteriaCount()).toBeGreaterThan(35);
  });

  it('should display removed criteria header', () => {
    expect(criteria.removedCriteriaHeader.isDisplayed()).toBe(true);
  });

  describe('when clicked on see all criteria', () => {
    beforeEach(async () => {
      page.seeAll.scrollAndClick();
    });

    it('should display all criteria', () => {
      criteria.expandRemovedCriteria();
      expect(criteria.criteriaCount()).toBe(78);
    });
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
