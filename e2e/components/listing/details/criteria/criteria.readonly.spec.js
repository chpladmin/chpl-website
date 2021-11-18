import CriteriaComponent from './criteria.po';
import Hooks from '../../../../utilities/hooks';
import ListingPage from '../../../../pages/listing/listing.po';

let criteria;
let hooks;
let page;
let uiUpgradeFlag;

beforeEach(async () => {
  criteria = new CriteriaComponent();
  page = new ListingPage();
  hooks = new Hooks();
  uiUpgradeFlag = criteria.uiUpgradeFlag();
});

describe('the Criteria Component on', () => {
  describe('the 2015 listing page', () => {
    beforeEach(async () => {
      hooks.open('#/listing/9833');
      await hooks.waitForSpinnerToDisappear();
    });

    it('should display attested criteria by default', () => {
      browser.waitUntil(() => criteria.criteriaCount() > 1);
      expect(criteria.criteriaCount()).toBeGreaterThan(35);
    });

    xit('should display removed criteria header', () => {
      expect(criteria.removedCriteriaHeader.isDisplayed()).toBe(true);
    });

    describe('when clicked on see all criteria', () => {
      beforeEach(async () => {
        page.seeAll.click();
      });

      it('should display all criteria', () => {
        if (uiUpgradeFlag) {
          criteria.expandRemovedCriteria();
        }
        console.log('Criteria count:', criteria.criteriaCount());
      });
    });

    it('should display view only a1 criteria details', () => {
      console.log('Start expanding criteria');
      criteria.expandCriteria('1', '170.315 (a)(1)');
      console.log('Completed expanding criteria', criteria.criteriaDetailTable('1', '170.315 (a)(1)'));
      expect(criteria.criteriaDetailTable('1', '170.315 (a)(1)').isDisplayed()).toBe(true);
      console.log('Completed the expect');
    });

    it('should display view only removed a6 criteria details', () => {
      if (uiUpgradeFlag) {
        criteria.expandRemovedCriteria();
      }
      criteria.expandCriteria('6', '170.315 (a)(6)');
      expect(criteria.criteriaDetailTable('6', '170.315 (a)(6)').isDisplayed()).toBe(true);
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

    describe('when clicked on see all criteria', () => {
      beforeEach(async () => {
        page.seeAll.click();
      });

      it('should display all criteria', () => {
        expect(criteria.criteriaCount()).toBe(59);
      });
    });

    it('should display view only a1 criteria details', () => {
      criteria.expandCriteria('61', '170.314 (a)(1)');
      expect(criteria.criteriaDetailTable('61', '170.314 (a)(1)').isDisplayed()).toBe(true);
    });
  });
});
