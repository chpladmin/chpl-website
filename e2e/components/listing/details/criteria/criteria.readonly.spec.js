import CriteriaComponent from './criteria.po';
import Hooks from '../../../../utilities/hooks';
import ListingPage from '../../../../pages/listing/listing.po';

let criteria; let hooks; let page; let uiUpgradeFlag;

describe('the Listing page', () => {
  beforeEach(async () => {
    criteria = new CriteriaComponent();
    page = new ListingPage();
    hooks = new Hooks();
    hooks.open('#/listing/9833');
    hooks.waitForSpinnerToDisappear();
    uiUpgradeFlag = criteria.uiUpgradeFlag();
  });

  it('should display attested criteria by default', () => {
    browser.waitUntil(() => criteria.criteriaCount() > 1);
    expect(criteria.criteriaCount()).toBeGreaterThan(35);
  });

  it.skip('should display removed criteria header', () => {
    expect(criteria.removedCriteriaHeader.isDisplayed()).toBe(true);
  });

  describe('when clicked on see all criteria', () => {
    beforeEach(async () => {
      page.seeAll.scrollAndClick();
    });

    it('should display all criteria', () => {
      if (uiUpgradeFlag) {
        criteria.expandRemovedCriteria();
      }
      expect(criteria.criteriaCount()).toBe(78);
    });
  });

  it('should display view only a1 criteria details', () => {
    criteria.expandCriteria('1', '170.315 (a)(1)');
    expect(criteria.criteriaDetailTable('1', '170.315 (a)(1)').isDisplayed()).toBe(true);
  });

  it('should display view only removed a6 criteria details', () => {
    if (uiUpgradeFlag) {
      criteria.expandRemovedCriteria();
    }
    criteria.expandCriteria('6', '170.315 (a)(6)');
    expect(criteria.criteriaDetailTable('6', '170.315 (a)(6)').isDisplayed()).toBe(true);
  });
});
