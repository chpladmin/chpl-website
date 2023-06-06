import Hooks from '../../../utilities/hooks';
import AddressComponent from '../../../components/address/address.po';
import LoginComponent from '../../../components/login/login.sync.po';
import { open } from '../../../utilities/hooks.async';

import OrganizationPage from './organization.po';

let address;
let hooks;
let login;
let page;

describe('the ONC-ACB Management page', () => {
  beforeEach(async () => {
    page = new OrganizationPage();
    hooks = new Hooks();
    address = new AddressComponent();
    login = new LoginComponent();
    await open('#/resources/overview');
  });

  afterEach(() => {
    login.logOut();
  });

  describe('when logged in as SLI Compliance', () => {
    beforeEach(async () => {
      await login.logIn('sli');
      await page.open('onc-acbs');
    });

    xit('should display registered users under SLI Compliance', () => {
      const acb = 'SLI Compliance';
      expect(page.manageUsersPanelHeader).toBeDisplayed();
      expect(page.manageUsersPanel.getText()).toContain('ROLE_ACB');
      expect(page.manageUsersPanel.getText()).toContain('SLI Compliance');
    });

    describe('when editing SLI Compliance details', () => {
      beforeEach(() => {
        page.organizationEditButton.click();
      });

      it('should show error for missing input in required field - ACB Name', () => {
        page.organizationName.clearValue();
        expect(page.errorMessage.getText()).toBe('Field is required');
      });

      it('should show error for missing input in required field - Website', () => {
        page.organizationWebsite.clearValue();
        expect(page.errorMessage.getText()).toBe('Field is required');
      });

      it('should show error for missing input in required field - Address', () => {
        address.editAddress.clearValue();
        expect(page.addressErrorMessage.getText()).toContain('Field is required');
      });
    });
  });

  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open('onc-acbs');
    });

    it('should have at least 6 ACB organizations', () => {
browser.saveScreenshot(`test_reports/e2e/screenshot/${Date.now()}.png`);
      expect(page.organizationListCount()).toBeGreaterThanOrEqual(6);
    });

    xit('should allow user to unretire and retire existing ACB', () => {
      const acb = 'CCHIT';
      const acbId = '2';
      const organizationType = 'ACB';
      const timestamp = Date.now();
      const websiteUrl = `https://website${timestamp}.com`;
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const acbAddress = {
        address: `address${timestamp}`,
        city: `city${timestamp}`,
        state: `state${timestamp}`,
        zip: `11111${timestamp}`,
        country: `country${timestamp}`,
      };

      page.openOrganizationDetails(acb);
      page.organizationEditButton.click();
      page.retireOrganizationCheckbox.click();
      page.organizationWebsite.setValue(websiteUrl);
      address.set(acbAddress);
      page.saveOrganizationButton.click();
      expect(page.generalInformation(organizationType, acbId).getText()).toContain('Retired: No');
      hooks.open('#/organizations/onc-acbs');
      hooks.waitForSpinnerToDisappear();
      page.openOrganizationDetails(acb);
      hooks.waitForSpinnerToDisappear();
      page.organizationEditButton.click();
      page.retireOrganizationCheckbox.click();
      page.retirementDate.setValue(today);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
      expect(page.generalInformation(organizationType, acbId).getText()).toContain('Retired: Yes');
    });
  });
});
