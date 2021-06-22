import OrganizationPage from './organization.po';
import Hooks from '../../../utilities/hooks';
import AddressComponent from '../../../components/address/address.po';
import LoginComponent from '../../../components/login/login.po';

let address;
let hooks;
let login;
let page;

describe('the ONC-ACB Management page', () => {
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

  beforeEach(async () => {
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    page = new OrganizationPage();
    hooks = new Hooks();
    address = new AddressComponent();
    login = new LoginComponent();
    await hooks.open('#/organizations/onc-acbs');
  });

  it('should have at least 6 ACB organizations', () => {
    expect(page.organizationListCount()).toBeGreaterThanOrEqual(6);
  });

  it('should display ACB organizations in alphabetical order', () => {
    const acbCount = page.organizationListCount();
    let i;
    for (i = 1; i < acbCount; i += 1) {
      expect(page.organizationListValue(i - 1).getText()).toBeLessThan(page.organizationListValue(i).getText());
    }
  });

  describe('when logged in as UL', () => {
    beforeEach(() => {
      login.logIn('ul');
    });

    afterEach(() => {
      login.logOut();
    });

    it('should display registered users under UL', () => {
      const acb = 'UL LLC';
      page.organizationNameButton(acb).click();
      expect(page.manageUsersPanelHeader).toBeDisplayed();
      expect(page.manageUsersPanel.getText()).toContain('Role: ROLE_ACB');
      expect(page.manageUsersPanel.getText()).toContain('Organization: UL LLC');
    });

    it('should not present the option to edit ACB details for Drummond Group', () => {
      const acb = 'Drummond Group';
      page.organizationNameButton(acb).click();
      expect(page.organizationEditButton.isDisplayed()).toBe(false);
    });

    it('should not display registered users under Drummond Group', () => {
      const acb = 'Drummond Group';
      page.organizationNameButton(acb).click();
      expect(page.manageUsersPanelHeader.isDisplayed()).toBe(false);
    });

    describe('when editing UL details', () => {
      beforeEach(() => {
        const acb = 'UL LLC';
        page.organizationNameButton(acb).click();
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
    beforeEach(() => {
      login.logIn('onc');
    });

    afterEach(() => {
      login.logOut();
    });

    it('should allow user to unretire and retire existing ACB', () => {
      const acb = 'CCHIT';
      const acbId = '2';
      const organizationType = 'ACB';
      page.organizationNameButton(acb).click();
      page.organizationEditButton.click();
      page.retireOrganizationCheckbox.click();
      page.organizationWebsite.setValue(websiteUrl);
      address.set(acbAddress);
      page.saveOrganizationButton.click();
      expect(page.generalInformation(organizationType, acbId).getText()).toContain('Retired: No');
      hooks.open('#/organizations/onc-acbs');
      hooks.waitForSpinnerToDisappear();
      page.organizationNameButton(acb).click();
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
