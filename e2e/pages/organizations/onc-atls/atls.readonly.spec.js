import AtlPage from './atls.po';
import Hooks from '../../../utilities/hooks';
import AddressComponent from '../../../components/address/address.po';
import LoginComponent from '../../../components/login/login.po';
import ToastComponent from '../../../components/toast/toast.po';

let hooks, page, address, login, toast;

describe('the ONC-ATL Management page', () => {
    const timestamp = (new Date()).getTime();
    const websiteUrl = 'https://website' + timestamp + '.com';
    let today = new Date().toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
    const atlAddress = {
    address: 'address' + timestamp,
    city: 'city' + timestamp,
    state: 'state' + timestamp,
    zip: '11111' + timestamp,
    country: 'country' + timestamp,
    };

    beforeEach(async () => {
      browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
      browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
      page = new AtlPage();
      hooks = new Hooks();
      address = new AddressComponent();
      login = new LoginComponent();
      toast = new ToastComponent();
      await hooks.open('#/organizations/onc-atls');
    });

    it('should display all ATL organizations', () => {
	let expectedAtls = ["ONC-ATLs", "CCHIT", "Drummond Group", "ICSA Labs", "National Committee for Quality Assurance (NCQA)", "National Technical Systems", "SLI Compliance", "UL LLC"];
	let i;
	  for (i=1; i<=7; i++) {
        expect(page.atlsList(i).getText()).toBe(expectedAtls[i]);
      }
    });

    describe('when impersonating as an ATL', () => {
      beforeEach(() => {
      login.logIn('onc');
      login.logoutButton.waitForDisplayed();
      hooks.open('#/users');
      page.impersonateUser.scrollIntoView({block: 'center', inline: 'center'});
      page.impersonateUser.click();
      hooks.open('#/organizations/onc-atls');
    });

    afterEach(() => {
      login.logOut();
    });

    it('should display registered users under the organization', () => {
      let atl = 'UL LLC';
      page.atlNameButton(atl).click();
      expect(page.manageUsersPanelHeader).toBeDisplayed();
      expect(page.manageUsersPanel.getText()).toContain('Role: ROLE_ATL');
      expect(page.manageUsersPanel.getText()).toContain('Organization: UL LLC');
    });

    it('should allow user to edit own ATL details', () => {
	  let atl = 'UL LLC';
      let timestamp = (new Date()).getTime();
      let newAtlName = atl + ' - ' + timestamp;
	  page.atlNameButton(atl).click();
      page.atlEditButton.click();
      page.atlName.setValue(newAtlName);
      page.atlWebsite.setValue(websiteUrl);
      address.set(atlAddress);
      page.saveOrganizationButton.click();
      toast.clearAllToast();
      expect(page.atlGeneralInformation.getText()).toContain(newAtlName);
      expect(page.atlGeneralInformation.getText()).toContain(websiteUrl);
      expect(page.atlGeneralInformation.getText()).toContain(atlAddress.address);
      expect(page.atlGeneralInformation.getText()).toContain(atlAddress.city);
      expect(page.atlGeneralInformation.getText()).toContain(atlAddress.state);
      expect(page.atlGeneralInformation.getText()).toContain(atlAddress.zip);
      expect(page.atlGeneralInformation.getText()).toContain(atlAddress.country);
      page.atlEditButton.click();
      page.atlName.setValue(atl);
      page.saveOrganizationButton.click();
    });

    it('should not present the option to edit ATL details other than own', () => {
	  let atl = 'Drummond Group';
      page.atlNameButton(atl).click();
      expect(page.atlEditButton.isDisplayed()).toBe(false);
    });

    it('should not display registered users under the organization that is not their own ', () => {
      let atl = 'Drummond Group';
      page.atlNameButton(atl).click();
      expect(page.manageUsersPanelHeader.isDisplayed()).toBe(false);
      });
    });

    describe('when logged in as ONC', () => {
      beforeEach(() => {
        login.logIn('onc');
        login.logoutButton.waitForDisplayed();
      });

      afterEach(() => {
        login.logOut();
      });

    it('should allow user to unretire and retire existing ATL', () => {
	  let atl = 'CCHIT';
      hooks.open('#/organizations/onc-atls');
      page.atlNameButton(atl).click();
	  page.atlEditButton.click();
	  page.retireOrganizationCheckbox.click();
      page.atlWebsite.clearValue();
	  page.atlWebsite.addValue(websiteUrl);
      address.set(atlAddress);
	  page.saveOrganizationButton.click();
      expect(page.retiredStatus.getText()).toContain('Retired: No');
      toast.clearAllToast();
      hooks.waitForSpinnerToDisappear();
      page.atlNameButton(atl).click();
      page.atlEditButton.click();
      hooks.waitForSpinnerToDisappear();
	  page.retireOrganizationCheckbox.click();
	  page.retirementDate.addValue(today);
	  page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();
	  expect(page.retiredStatus.getText()).toContain('Retired: Yes');
      });
    });
});
