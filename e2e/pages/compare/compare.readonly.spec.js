import Hooks from '../../utilities/hooks';

import ComparePage from './compare.po';

let hooks;
let page;

describe('the compare page', () => {
  beforeEach(async () => {
    page = new ComparePage();
    hooks = new Hooks();
    await hooks.open('#/compare/9261&9956');
  });

  describe('when looking at specific data', () => {
    it('should know what the decertification date is', () => {
      browser.waitUntil(() => page.isListingLoaded('15.02.02.3007.A056.01.00.0.180214') && page.isListingLoaded('15.04.04.2916.smar.07.01.1.190328'));
      expect(page.getDecertificationDate('15.02.02.3007.A056.01.00.0.180214')).toBe('Jul 19, 2021');
      expect(page.getDecertificationDate('15.04.04.2916.smar.07.01.1.190328')).toBe('N/A');
    });
  });

  describe('when viewing all criteria', () => {
    beforeEach(() => {
      page.checkShowAllCheckbox();
      page.certificationCriteriaLink.click();
    });

    it('should display all of the 78 certification criterias', () => {
      expect(page.allCCCQM.length).toBe(78);
    });

    it('should correctly display the criteria number/title', () => {
      expect(page.getCellWithCriteriaNumber('170.315 (a)(1)').getText()).toBe('170.315 (a)(1): Computerized Provider Order Entry (CPOE) - Medications');
    });

    it('should correctly display the retired criteria number/title', () => {
      expect(page.getCellWithCriteriaNumber('170.315 (a)(6)').getText()).toContain('Removed | 170.315 (a)(6): Problem List');
    });
  });

  describe('when viewing all CQMs', () => {
    beforeEach(() => {
      page.checkShowAllCheckbox();
      page.clinicalQualityMeasuresLink.click();
    });

    it('should display all CQMs', () => {
      expect(page.allCCCQM.length).toBe(108);
    });
  });
});
