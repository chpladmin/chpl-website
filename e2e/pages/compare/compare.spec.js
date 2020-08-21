import ComparePage from './compare.po'
import Hooks from '../../utilities/hooks'

let hooks, page;

beforeEach(async () => {
    page = new ComparePage();
    hooks = new Hooks();
    await hooks.open('#/compare/9261&9956');
});

describe('on compare page after clicking show all-', () => {

    it('All 78 certification criteria should be displayed', () => {
        page.checkShowAllCheckbox();
        page.certificationCriterialink.scrollIntoView();
        page.certificationCriterialink.click();
        assert.equal(page.allCCCQM.length,78);
    })

    it('All 98 CQMs should be displayed', () => {
        page.checkShowAllCheckbox();
        page.clinicalQualityMeasuresLink.scrollIntoView();
        page.clinicalQualityMeasuresLink.click();
        assert.equal(page.allCCCQM.length,98);
    })

})