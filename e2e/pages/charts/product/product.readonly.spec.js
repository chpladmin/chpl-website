import ProductChartsPage from './product.po';
import Hooks from '../../../utilities/hooks';

let hooks, page;

beforeAll(async () => {
    page = new ProductChartsPage();
    hooks = new Hooks();
    hooks.open('#/charts');
    await hooks.waitForSpinnerToDisappear();
});

describe('on charts page - Unique product chart', () => {

    it('should only show 2015 edition products', () => {
        assert.include(page.chartTitle.getText(),2015);
        assert.notInclude(page.chartTitle.getText(),2014);
    });
    it('should only have all,2015,2015 cures options in "view certification criteria" dropdown', () => {
        assert.include(page.viewCertificationCriteriaDropdown.getText(),'All');
        assert.include(page.viewCertificationCriteriaDropdown.getText(),'2015');
        assert.include(page.viewCertificationCriteriaDropdown.getText(),'2015 Cures Update');
        assert.notInclude(page.viewCertificationCriteriaDropdown.getText(),'2014');
    });

});

describe('on charts page - Nonconformity chart', () => {
    beforeEach( () => {
        page.nonconformityChartButton.click();
        hooks.waitForSpinnerToDisappear();
    });

    it('should only have all,2015,2015 cures,program options in "view certification criteria" dropdown', () => {
        assert.include(page.viewCertificationCriteriaDropdown.getText(),'All');
        assert.include(page.viewCertificationCriteriaDropdown.getText(),'2015');
        assert.include(page.viewCertificationCriteriaDropdown.getText(),'2015 Cures Update');
        assert.include(page.viewCertificationCriteriaDropdown.getText(),'Program');
        assert.notInclude(page.viewCertificationCriteriaDropdown.getText(),'2014');
    });

});
