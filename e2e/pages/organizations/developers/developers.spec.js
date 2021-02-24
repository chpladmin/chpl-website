import DevelopersPage from './developers.po';
import Hooks from '../../../utilities/hooks';
import ContactComponent from '../../../components/contact/contact.po';
import LoginComponent from '../../../components/login/login.po';

let contact, hooks, login, page;

describe('the Developers page', () => {
  beforeEach(async () => {
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    hooks = new Hooks();
    contact = new ContactComponent();
    login = new LoginComponent();
    await hooks.open('#/organizations/developers');
  });

  describe('when logged in as an ACB', () => {
    beforeEach(() => {
      login.logIn('acb');
      login.logoutButton.waitForDisplayed();
    });

    afterEach(() => {
      login.logOut();
    });

    describe('when on the "Greenway Health, LLC" Developer page', () => {
      beforeEach(() => {
        let developer = 'Greenway Health, LLC';
        page = new DevelopersPage();
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
      });

      describe('when editing developer information', () => {
        beforeEach(() => {
          page.editDeveloper.click();
        });

        it('should not have friendly name text box under POC', () => {
          expect(contact.friendlyName.isDisplayed()).toBe(false);
        });
      });
    });
  });
});
