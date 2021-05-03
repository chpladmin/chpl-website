import AtlPage from './atls.po';
import Hooks from '../../../utilities/hooks';
import AddressComponent from '../../../components/address/address.po';
import LoginComponent from '../../../components/login/login.po';
import ToastComponent from '../../../components/toast/toast.po';

let hooks, page, address, login, toast;

describe('the ONC-ATL Management page', () => {
    const timestamp = (new Date()).getTime();
    const websiteUrl = 'http://www.example' + timestamp + '.com';
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

    describe('when logged in as ONC', () => {
      beforeEach(() => {
        login.logIn('onc');
        login.logoutButton.waitForDisplayed();
      });

      afterEach(() => {
       login.logOut();
      });
    
    it('should allow user to Create a new ATL', () => {
      let timestamp = (new Date()).getTime();
      let newAtlName = 'Zacb' + ' - ' + timestamp;	  
      page.atlCreatetButton.click();
	  page.atlName.addValue(newAtlName);
	  page.atlWebsite.addValue(websiteUrl);
      address.set(atlAddress);
      page.saveOrganizationButton.click();
      hooks.waitForSpinnerToDisappear();    
      toast.clearAllToast();
      page.atlNameButton(newAtlName).click();
      expect(page.atlGeneralInformation.getText()).toContain(newAtlName);
      expect(page.atlGeneralInformation.getText()).toContain(websiteUrl);
      expect(page.atlGeneralInformation.getText()).toContain(atlAddress.address);
      expect(page.atlGeneralInformation.getText()).toContain(atlAddress.city);
      expect(page.atlGeneralInformation.getText()).toContain(atlAddress.state);
      expect(page.atlGeneralInformation.getText()).toContain(atlAddress.zip);
      expect(page.atlGeneralInformation.getText()).toContain(atlAddress.country);
      });
   });
});
