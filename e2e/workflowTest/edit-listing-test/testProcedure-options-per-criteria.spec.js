import ListingPage from '../../pages/listing/listing.po';
import Hooks from '../../utilities/hooks';
import CriteriaComponent from '../../components/listing/details/criteria/criteria.po';
import LoginComponent from '../../components/login/login.po';

let criteria;
let hooks;
let login;
let page;
const inputs = require('./dataProviders/testProcedure-options-dp');

inputs.forEach((input) => {
  const { criteriaName } = input;
  const { testProcedureOptions } = input;
  const { id } = input;
  const { criteriaOld } = input;
  const { cures } = input;

  describe('On the 2015 Listing editing page', () => {
    beforeEach(async () => {
      page = new ListingPage();
      hooks = new Hooks();
      login = new LoginComponent();
      criteria = new CriteriaComponent();
      await hooks.open('#/listing/10599');
    });

    describe('When ONC logged in', () => {
      beforeEach(async () => {
        login.logIn('onc');
        page.editCertifiedProduct.scrollAndClick();
        hooks.waitForSpinnerToDisappear();
      });

      afterEach(() => {
        browser.refresh();  /// it is very complex to exit the opened window based on uiUpgrade flag so temporary adding this
        login.logOut();
      });

      it(`should be able to see only correct options for test procedures for ${criteriaName}`, () => {
        const expected = testProcedureOptions;
        if (criteria.uiUpgradeFlag()) {
          criteria.expandCriteria(id);
          criteria.editCriteria(id);
          criteria.attestToggle.scrollAndClick();
          criteria.addItem('test-procedures');
          criteria.testProcedure.scrollIntoView({ block: 'center', inline: 'center' });
          criteria.testProcedure.scrollAndClick();
          const actual = new Set(criteria.testProcedureDropdownOptions.map((item) => item.getText()));
          expect(actual.size).toBe(expected.length);
          expected.forEach((exp) => {
            expect(actual.has(exp)).toBe(true, `did not find expected option of test procedure: "${exp}"`);
          });
        } else {
          criteria.openUnattestedCriteriaOld(criteriaOld, cures);
          criteria.attestCriteriaOld(criteriaOld);
          const actual = new Set(criteria.testProcedureDropdownOptionsOld.map((item) => item.getText()));
          expect(actual.size - 2).toBe(expected.length);
          expected.forEach((exp) => {
            expect(actual.has(exp)).toBe(true, `did not find expected option of test procedure: "${exp}"`);
          });
        }
      });
    });
  });
});
