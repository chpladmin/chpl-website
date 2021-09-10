import OrganizationPage from './organization.po';
import Hooks from '../../../utilities/hooks';
import AddressComponent from '../../../components/address/address.po';
import LoginComponent from '../../../components/login/login.po';
import UsersPage from '../../users/user.po';

let address;
let hooks;
let login;
let page;
let user;

describe('the ONC-ATL Management page', () => {
  const timestamp = Date.now();
  const websiteUrl = `http://www.example${timestamp}.com`;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const atlAddress = {
    address: `address${timestamp}`,
    city: `city${timestamp}`,
    state: `state${timestamp}`,
    zip: `11111${timestamp}`,
    country: `country${timestamp}`,
  };

  beforeEach(async () => {
    page = new OrganizationPage();
    hooks = new Hooks();
    login = new LoginComponent();
    address = new AddressComponent();
    user = new UsersPage();
    await hooks.open('#/organizations/onc-atls');
  });

  it('should have at least 7 ATL organizations', () => {
    expect(page.organizationListCount()).toBeGreaterThanOrEqual(7);
  });

  it('should display ATL organizations in alphabetical order', () => {
    const atlCount = page.organizationListCount();
    let i;
    for (i = 1; i < atlCount; i += 1) {
      expect(page.organizationListValue(i - 1).getText()).toBeLessThan(page.organizationListValue(i).getText());
    }
  });

  describe('when impersonating as UL', () => {
    beforeEach(() => {
      login.logIn('onc');
      hooks.open('#/users');
      hooks.waitForSpinnerToDisappear();
      user.impersonateUser('Chris Crescioli');
      hooks.waitForSpinnerToDisappear();
      hooks.open('#/organizations/onc-atls');
      hooks.waitForSpinnerToDisappear();
    });

    afterEach(() => {
      login.logOut();
    });

    it('should display registered users under UL', () => {
      const atl = 'UL LLC';
      page.organizationNameButton(atl).scrollAndClick();
      hooks.waitForSpinnerToDisappear();
      expect(page.manageUsersPanelHeader).toBeDisplayed();
      expect(page.manageUsersPanel.getText()).toContain('ROLE_ATL');
      expect(page.manageUsersPanel.getText()).toContain('UL LLC');
    });

    it('should not present the option to edit ATL details for Drummond Group', () => {
      const atl = 'Drummond Group';
      page.organizationNameButton(atl).scrollAndClick();
      expect(page.organizationEditButton.isDisplayed()).toBe(false);
    });

    it('should not display registered users under Drummond Group ', () => {
      const atl = 'Drummond Group';
      page.organizationNameButton(atl).scrollAndClick();
      expect(page.manageUsersPanelHeader.isDisplayed()).toBe(false);
    });
  });

  describe('when logged in as ONC', () => {
    beforeEach(() => {
      login.logIn('onc');
    });

    afterEach(() => {
      login.logOut();
    });

    it('should allow user to unretire and retire existing ATL', () => {
      const atl = 'CCHIT';
      const organizationType = 'ATL';
      const atlId = '2';
      hooks.open('#/organizations/onc-atls');
      hooks.waitForSpinnerToDisappear();
      page.organizationNameButton(atl).scrollAndClick();
      hooks.waitForSpinnerToDisappear();
      page.organizationEditButton.scrollAndClick();
      page.retireOrganizationCheckbox.scrollAndClick();
      page.organizationWebsite.setValue(websiteUrl);
      address.set(atlAddress);
      page.saveOrganizationButton.scrollAndClick();
      hooks.waitForSpinnerToDisappear();
      expect(page.generalInformation(organizationType, atlId).getText()).toContain('Retired: No');
      hooks.open('#/organizations/onc-atls');
      hooks.waitForSpinnerToDisappear();
      page.organizationNameButton(atl).scrollAndClick();
      hooks.waitForSpinnerToDisappear();
      page.organizationEditButton.scrollAndClick();
      page.retireOrganizationCheckbox.scrollAndClick();
      page.retirementDate.setValue(today);
      page.saveOrganizationButton.scrollAndClick();
      hooks.waitForSpinnerToDisappear();
      expect(page.generalInformation(organizationType, atlId).getText()).toContain('Retired: Yes');
    });
  });
});
