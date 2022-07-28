import ListingPage from '../../pages/listing/listing.po';
import Hooks from '../../utilities/hooks';
import CriteriaComponent from '../../components/listing/details/criteria/criteria.po';
import LoginComponent from '../../components/login/login.sync.po';

let criteria;
let hooks;
let login;
let page;
const inputs = require('./dataProviders/attribute-value-options-dp');

inputs.forEach((input) => {
  const {
    criteriaName,
    testProcedureOptions,
    id,
    criteriaOld,
    cures,
    testToolsOptions,
  } = input;

  describe('As an ONC user, On the 2015 Listing editing page', () => {
    beforeEach(async () => {
      page = new ListingPage();
      hooks = new Hooks();
      login = new LoginComponent();
      criteria = new CriteriaComponent();
      await hooks.open('#/listing/10599/view/edit');
    });

    describe('When ONC logged in', () => {
      beforeEach(async () => {
        login.logIn('onc');
        hooks.waitForSpinnerToDisappear();
      });

      afterEach(() => {
        browser.refresh();  /// it is very complex to exit the opened window based on uiUpgrade flag so temporary adding this
        login.logOut();
      });

      it(`can see correct options for test tools and test procedures for ${criteriaName}`, () => {
        const expectedTt = testToolsOptions;
        const expectedTp = testProcedureOptions;
        if (criteria.uiUpgradeFlag()) {
          criteria.expandCriteria(id);
          criteria.editCriteria(id);
          criteria.attestToggle.click();
          criteria.addItem('test-procedures');
          criteria.testProcedure.scrollIntoView({ block: 'center', inline: 'center' });
          criteria.testProcedure.click();
          const actualTp = new Set(criteria.testProcedureDropdownOptions.map((item) => item.getText()));
          expect(actualTp.size).toBe(expectedTp.length);
          expectedTp.forEach((exp) => {
            expect(actualTp.has(exp)).toBe(true, `did not find expected option of test procedure: "${exp}"`);
          });
          browser.keys('Escape');
          criteria.closeItem('test-procedures');
          criteria.addItem('test-tools');
          criteria.testTools.click();
          const actualTt = new Set(criteria.testToolsDropdownOptions.map((item) => item.getText()));
          expect(actualTt.size).toBe(expectedTt.length);
          expectedTt.forEach((exp) => {
            expect(actualTt.has(exp)).toBe(true, `did not find expected option of test tools: "${exp}"`);
          });
        } else {
          criteria.openUnattestedCriteriaOld(criteriaOld, cures);
          criteria.attestCriteriaOld(criteriaOld);
          const actualTt = new Set(criteria.testToolsDropdownOptionsOld.map((item) => item.getText()));
          expect(actualTt.size - 2).toBe(expectedTt.length);
          expectedTt.forEach((exp) => {
            expect(actualTt.has(exp)).toBe(true, `did not find expected option of test tools: "${exp}"`);
          });
          const actualTp = new Set(criteria.testProcedureDropdownOptionsOld.map((item) => item.getText()));
          expect(actualTp.size - 2).toBe(expectedTp.length);
          expectedTp.forEach((exp) => {
            expect(actualTp.has(exp)).toBe(true, `did not find expected option of test procedure: "${exp}"`);
          });
        }
      });
    });
  });
});
