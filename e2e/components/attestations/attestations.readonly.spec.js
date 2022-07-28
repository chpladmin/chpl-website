import DevelopersPage from '../../pages/organizations/developers/developers.po';
import Hooks from '../../utilities/hooks';
import LoginComponent from '../login/login.sync.po';

import AttestationsComponent from './attestations.po';

let component;
let hooks;
let login;
let page;

describe('the Attestations component', () => {
  beforeEach(async () => {
    component = new AttestationsComponent();
    page = new DevelopersPage();
    hooks = new Hooks();
    login = new LoginComponent();
    await hooks.open('#/organizations/developers');
  });

  afterEach(() => {
    if (component.detailsAreDisplayed()) {
      component.closeAttestations();
    }
    login.logOut();
  });

  describe('for Viztek, LLC', () => {
    beforeEach(() => {
      page.selectDeveloper('Viztek, LLC');
    });

    it('should not show any attestations data', () => {
      const periodStart = 'Jun 30, 2020';
      expect(component.getAttestationSummary(periodStart)).toBeUndefined();
    });

    describe('while logged in as ROLE_ONC', () => {
      beforeEach(() => {
        login.logIn('onc');
        hooks.waitForSpinnerToDisappear();
      });

      it('should show no attestations submitted for the first period', () => {
        const periodStart = 'Jun 30, 2020';
        expect(component.getAttestationSummary(periodStart)).toBe('No Attestations submitted');
      });

      it('should allow cancellation of creating an exception for an unattested period', () => {
        const periodStart = 'Jun 30, 2020';
        component.initiateUnattestedException(periodStart);
        expect(component.exceptionText).toBe('This action will re-open the Attestations submission feature for Viztek, LLC for Jun 30, 2020 to Mar 31, 2022. Please confirm you want to continue.');
        expect(component.isCreatingException()).toBe(true);
        component.cancelException();
        expect(component.isCreatingException()).toBe(false);
      });
    });
  });

  describe('for Health Metrics System, Inc', () => {
    beforeEach(() => {
      page.selectDeveloper('3007');
    });

    it('should not show any attestations data', () => {
      const periodStart = 'Jun 30, 2020';
      expect(component.getAttestationSummary(periodStart)).toBeUndefined();
    });

    describe('while logged in as ROLE_DEVELOPER', () => {
      beforeEach(() => {
        login.logIn('developer');
        hooks.waitForSpinnerToDisappear();
      });

      it('should show no attestations submitted for the first period', () => {
        const periodStart = 'Jun 30, 2020';
        expect(component.getAttestationSummary(periodStart)).toBeUndefined();
      });

      it('should have a disabled "submit attestations" button', () => {
        expect(component.canSubmitAttestations()).toBe(false);
      });
    });
  });

  describe('for MDToolbox', () => {
    beforeEach(() => {
      page.selectDeveloper('MDToolbox');
      login.logIn('onc');
      hooks.waitForSpinnerToDisappear();
    });

    it('should show attestations submitted for the first period', () => {
      const periodStart = 'Jun 30, 2020';
      expect(component.getAttestationSummary(periodStart)).toBe('Attestations submitted');
    });

    it('should show responses', () => {
      const periodStart = 'Jun 30, 2020';
      component.viewAttestations(periodStart);
      const responses = [
        { key: 'Information Blocking', value: 'Compliant' },
        { key: 'Assurances', value: 'Compliant with the requirements of 45 CFR 170.402; certifies to the criterion at 45 CFR 170.315(b)(10) and provides all of its customers of certified health IT with health IT certified to the certification criterion in 45 CFR 170.315(b)(10).' },
        { key: 'Communications', value: 'Compliant' },
        { key: 'Application Programming Interfaces', value: 'Not Applicable' },
        { key: 'Real World Testing', value: 'Compliant' },
      ];
      responses.forEach((item) => {
        expect(component.getAttestationResponse(item.key)).toBe(item.value);
      });
    });

    it('should allow cancellation of creating an exception for an attested period', () => {
      const periodStart = 'Jun 30, 2020';
      component.viewAttestations(periodStart);
      component.createException();
      expect(component.exceptionText).toBe('This action will re-open the Attestations submission feature for MDToolbox for Jun 30, 2020 to Mar 31, 2022. Please confirm you want to continue.');
      expect(component.isCreatingException()).toBe(true);
      component.cancelException();
      expect(component.isCreatingException()).toBe(false);
    });
  });
});
