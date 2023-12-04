import Hooks from '../../utilities/hooks';
import CriteriaComponent from '../../components/listing/details/criteria/criteria.po';
import LoginComponent from '../../components/login/login.sync.po';

import inputs from './dataProviders/attribute-value-options-dp';

let criteria;
let hooks;
let login;

inputs.forEach((input) => {
  const {
    criteriaName,
    conformanceMethodOptions,
    id,
    testToolsOptions,
  } = input;

  describe('As an ONC user, On the 2015 Listing editing page', () => {
    beforeEach(async () => {
      hooks = new Hooks();
      login = new LoginComponent();
      criteria = new CriteriaComponent();
      await hooks.open('#/listing/10599/edit');
    });

    describe('When ONC logged in', () => {
      beforeEach(async () => {
        login.logIn('onc');
        hooks.waitForSpinnerToDisappear();
      });

      afterEach(() => {
        browser.refresh(); // it is very complex to exit the opened window based on uiUpgrade flag so temporary adding this
        login.logOut();
      });

      it(`can see correct options for Test Tools and Conformance Methods for ${criteriaName}`, () => {
        const expectedTt = testToolsOptions;
        const expectedCm = conformanceMethodOptions;
        criteria.editCriteriaButton(criteriaName, id).scrollIntoView({ block: 'center', inline: 'center' });
        criteria.openUnattestedCriteria(criteriaName, id);
        criteria.attestCriteria(criteriaName);
        const actualTt = new Set(criteria.testToolsDropdownOptions.map((item) => item.getText()));
        expect(actualTt.size - 2).toBe(expectedTt.length);
        expectedTt.forEach((exp) => {
          expect(actualTt.has(exp)).toBe(true, `did not find expected option of test tools: "${exp}"`);
        });
        const actualCm = new Set(criteria.conformanceMethodDropdownOptions.map((item) => item.getText()));
        expect(actualCm.size - 2).toBe(expectedCm.length);
        expectedCm.forEach((exp) => {
          expect(actualCm.has(exp)).toBe(true, `did not find expected option of Conformance Method: "${exp}"`);
        });
      });
    });
  });
});
