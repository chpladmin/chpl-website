import ComparePage from './compare.po';
import Hooks from '../../utilities/hooks';

let hooks, page;

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
        assert.equal(page.allCCCQM.length,78);
    });

    it('should display all of the 98 CQMs', () => {
        page.checkShowAllCheckbox();
        page.clinicalQualityMeasuresLink.scrollIntoView();
        page.clinicalQualityMeasuresLink.click();
        assert.equal(page.allCCCQM.length,98);
    });
});
