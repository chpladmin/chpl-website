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

      it(`can see correct options for Test Tools and Conformance Methods for ${criteriaName} with id ${id}`, () => {
        const expectedTt = testToolsOptions;
        const expectedCm = conformanceMethodOptions;
        criteria.editCriteriaButton(criteriaName, id).scrollIntoView({ block: 'center', inline: 'center' });
        criteria.openUnattestedCriteria(criteriaName, id);
        criteria.attestCriteria(criteriaName);
        const actualTt = new Set(criteria.testToolsDropdownOptions.map((item) => item.getText()).filter((item) => item !== '' && item !== 'Select a Test Tool'));
        expectedTt.forEach((exp) => {
          expect(actualTt.has(exp)).toBe(true, `did not find expected Test Tool: "${exp}"`);
        });
        actualTt.forEach((act) => {
          expect(expectedTt.includes(act)).toBe(true, `found unexpected Test Tool: "${act}"`);
        });
        expect(actualTt.size).toBe(expectedTt.length);

        const actualCm = new Set(criteria.conformanceMethodDropdownOptions.map((item) => item.getText()).filter((item) => item !== '' && item !== 'Select a Conformance Method'));
        expectedCm.forEach((exp) => {
          expect(actualCm.has(exp)).toBe(true, `did not find expected Conformance Method: "${exp}"`);
        });
        actualCm.forEach((act) => {
          expect(expectedCm.includes(act)).toBe(true, `found unexpected Conformance Method: "${act}"`);
        });
        expect(actualCm.size).toBe(expectedCm.length);
      });
    });
  });
});
