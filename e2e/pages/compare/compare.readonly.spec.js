import ComparePage from './compare.po';
import Hooks from '../../utilities/hooks';

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

  it('should display all CQMs', () => {
    page.checkShowAllCheckbox();
    page.clinicalQualityMeasuresLink.scrollIntoView();
    page.clinicalQualityMeasuresLink.click();
    expect(page.allCCCQM.length).toBe(102);
  });
});
