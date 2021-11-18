import Hooks from '../../utilities/hooks';

import ComparePage from './compare.po';

let hooks;
let page;

beforeEach(async () => {
  page = new ComparePage();
  hooks = new Hooks();
  await hooks.open('#/compare/9261&9956');
});

describe('on compare page after clicking show all-', () => {
  it('should display all of the 78 certification criterias', () => {
    page.checkShowAllCheckbox();
    page.certificationCriteriaLink.scrollIntoView();
    page.certificationCriteriaLink.click();
    expect(page.allCCCQM.length).toBe(78);
  });

  describe('when viewing all criteria', () => {
    beforeEach(async () => {
      page.checkShowAllCheckbox();
      page.certificationCriteriaLink.scrollIntoView();
      page.certificationCriteriaLink.click();
    });

    it('should correctly display the criteria number/title', () => {
      expect(page.getCellWithCriteriaNumber('170.315 (a)(1)').getText()).toBe('170.315 (a)(1): Computerized Provider Order Entry (CPOE) - Medications');
    });

    it('should correctly display the retired criteria number/title', () => {
      expect(page.getCellWithCriteriaNumber('170.315 (a)(10)').getText()).toContain('Removed | 170.315 (a)(10): Drug-Formulary and Preferred Drug List Checks');
    });
  });

  it('should display all CQMs', () => {
    page.checkShowAllCheckbox();
    page.clinicalQualityMeasuresLink.scrollIntoView();
    page.clinicalQualityMeasuresLink.click();
    expect(page.allCCCQM.length).toBe(102);
  });
});
