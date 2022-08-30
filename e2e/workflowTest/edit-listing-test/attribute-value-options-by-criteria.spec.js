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
    conformanceMethodOptions,
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

      it(`can see correct options for Test Tools and Conformance Methods for ${criteriaName}`, () => {
        const expectedTt = testToolsOptions;
        const expectedCm = conformanceMethodOptions;

        if (criteria.uiUpgradeFlag()) {
          criteria.expandCriteria(id);
          criteria.editCriteria(id);
          criteria.attestToggle.click();
          criteria.addItem('conformance-methods');
          criteria.conformanceMethod.scrollIntoView({ block: 'center', inline: 'center' });
          criteria.conformanceMethod.click();
          const actualCm = new Set(criteria.conformanceMethodDropdownOptions.map((item) => item.getText()));
          expect(actualCm.size).toBe(expectedCm.length);
          expectedCm.forEach((exp) => {
            expect(actualCm.has(exp)).toBe(true, `did not find expected option of test procedure: "${exp}"`);
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
          criteria.editCriteriaOldButton(criteriaOld).scrollIntoView({ block: 'center', inline: 'center' });
          criteria.openUnattestedCriteriaOld(criteriaOld, cures);
          criteria.attestCriteriaOld(criteriaOld);
          const actualTt = new Set(criteria.testToolsDropdownOptionsOld.map((item) => item.getText()));
          expect(actualTt.size - 2).toBe(expectedTt.length);
          expectedTt.forEach((exp) => {
            expect(actualTt.has(exp)).toBe(true, `did not find expected option of test tools: "${exp}"`);
          });
          const actualCm = new Set(criteria.conformanceMethodDropdownOptionsOld.map((item) => item.getText()));
          expect(actualCm.size - 2).toBe(expectedCm.length);
          expectedCm.forEach((exp) => {
            expect(actualCm.has(exp)).toBe(true, `did not find expected option of Conformance Method: "${exp}"`);
          });
        }
      });
    });
  });
});
