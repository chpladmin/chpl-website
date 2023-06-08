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

  afterEach(async () => {
    await login.logOut();
  });

  describe('when logged in as SLI Compliance', () => {
    beforeEach(async () => {
      await login.logIn('sli');
      await page.open('onc-acbs');
      await (browser.waitUntil(async () => await (await page.getManageUsersPanelHeader()).isDisplayed()));
      await (browser.waitUntil(async () => ((await (await page.getManageUsersPanelHeaderUserCount()).getText()) !== '(0 users)')));
    });

    it('should display registered users under SLI Compliance', async () => {
      await expect(await (await page.getManageUsersPanel()).getText()).toContain('ROLE_ACB');
      await expect(await (await page.getManageUsersPanel()).getText()).toContain('SLI Compliance');
    });

    // ignoring because "setValue" doesn't clear and set, just appends, which means all the validations go wrong
    xdescribe('when editing SLI Compliance details', () => {
      beforeEach(async () => {
        await (await page.getOrganizationEditButton()).click();
      });

      it('should show error for missing input in required field - ACB Name', async () => {
        await (await page.getOrganizationName()).clearValue('');
        await expect(await (await page.getNameErrorMessage()).getText()).toBe('Name is required');
      });

      it('should show error for missing input in required field - Website', async () => {
        await (await page.getOrganizationWebsite()).clearValue();
        await expect(await (await page.getWebsiteErrorMessage()).getText()).toBe('Website is required');
      });

      it('should show error for missing input in required field - Address line 1', async () => {
        await address.organizationLine1.clearValue();
        await expect(await (await page.getLine1ErrorMessage()).getText()).toContain('Address is required');
      });
    });
  });

  describe('when logged in as ONC', () => {
    beforeEach(async () => {
      await login.logIn('onc');
      await page.open('onc-acbs');
      await (browser.waitUntil(async () => ((await page.organizationListCount()) > 0)));
    });

    it('should have at least 6 ACB organizations', async () => {
      await expect(await page.organizationListCount()).toBeGreaterThanOrEqual(6);
    });

    // ignoring because "setValue" doesn't clear and set, just appends, which means all the validations go wrong
    xit('should allow user to unretire and retire existing ACB', async () => {
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

      await page.openOrganizationDetails(acb);
      await (await page.getOrganizationEditButton()).click();
      await (await page.getRetireOrganizationCheckbox()).click();
      await (await page.getOrganizationWebsite()).setValue(websiteUrl);
      await address.set(acbAddress);
      await (await page.getSaveOrganizationButton()).click();
      await expect(await (await page.generalInformation(organizationType, acbId)).getText()).toContain('Retired: No');
      await hooks.open('#/organizations/onc-acbs');
      await hooks.waitForSpinnerToDisappear();
      await page.openOrganizationDetails(acb);
      await hooks.waitForSpinnerToDisappear();
      await (await page.getOrganizationEditButton()).click();
      await (await page.getRetireOrganizationCheckbox()).click();
      await (await page.getRetirementDate()).setValue(today);
      await (await page.getSaveOrganizationButton()).click();
      await hooks.waitForSpinnerToDisappear();
      await expect(await (await page.generalInformation(organizationType, acbId)).getText()).toContain('Retired: Yes');
    });
  });
});
