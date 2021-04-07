import DevelopersPage from './developers.po';
import Hooks from '../../../utilities/hooks';
import ContactComponent from '../../../components/contact/contact.po';
import LoginComponent from '../../../components/login/login.po';
import ActionBarComponent from '../../../components/action-bar/action-bar.po';
import ToastComponent from '../../../components/toast/toast.po';
let actionBar, contact, hooks, login, page, toast;

describe('the Developers page', () => {
  beforeEach(async () => {
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    hooks = new Hooks();
    toast = new ToastComponent();
    contact = new ContactComponent();
    actionBar = new ActionBarComponent();
    login = new LoginComponent();
    await hooks.open('#/organizations/developers');
  });

  describe('when logged in as Drummond ACB', () => {
    beforeEach(() => {
      login.logIn('drummond');
      login.logoutButton.waitForDisplayed();
    });

    afterEach(() => {
      if (toast.toastContainer.isDisplayed()) {
        toast.clearAllToast();
      }
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

        it('should not allow to edit developer status', () => {
          expect(page.developerStatus.isDisplayed()).toBe(false);
        });

        it('should allow editing of POC', () => {
          let timestamp = (new Date()).getTime();
          let poc = {
            full: 'name' + timestamp,
            title: 'title' + timestamp,
            email: 'email' + timestamp + '@example.com',
            phone: 'phone' + timestamp,
            website: 'https://website' + timestamp + '.com',
          };
          contact.set(poc);
          actionBar.save();
          expect(toast.toastTitle.getText()).toEqual('Update processing');
          hooks.waitForSpinnerToDisappear();
          expect(page.developerContact).toHaveTextContaining(poc.full);
          expect(page.developerContact).toHaveTextContaining(poc.title);
          expect(page.developerContact).toHaveTextContaining(poc.phone);
          expect(page.developerContact).toHaveTextContaining(poc.email);
          expect(page.developerWebsite).toHaveTextContaining(poc.website);
        });

      });
      describe('when looking at developer with more than one product', () => {

        it('should have split developer button', () => {
          expect(page.splitDeveloper.isDisplayed()).toBe(true);
        });
        it('should not have merge developer button', () => {
          expect(page.mergeDeveloper.isDisplayed()).toBe(false);
        });

        it('should allow split to happen', () => {
          page.splitDeveloper.click();
          let timestamp = (new Date()).getTime();
          page.developerName.addValue('New developer' + timestamp);
          let poc = {
            full: 'name' + timestamp,
            email: 'email' + timestamp + '@example.com',
            phone: 'phone' + timestamp,
            website: 'https://website' + timestamp + '.com',
            address: 'address' + timestamp,
            city: 'city' + timestamp,
            state: 'state' + timestamp,
            zip: '11111' + timestamp,
            country: 'country' + timestamp,
          };
          contact.set(poc);
          page.moveDeveloperToSplit(3526);
          actionBar.save();
          browser.waitUntil( () =>toast.toastTitle.isDisplayed());
          expect(toast.toastTitle.getText()).toEqual('Split submitted');
        });
      });

      describe('when on the "athenahealth, Inc." Developer page which has listings owned by multiple ACBs', () => {
        beforeEach(() => {
          let developer = 'athenahealth, Inc.';
          page = new DevelopersPage();
          page.selectDeveloper(developer);
          page.getDeveloperPageTitle(developer).waitForDisplayed();
        });

        it('should show correct error message', () => {
          page.splitDeveloper.click();
          let timestamp = (new Date()).getTime();
          page.developerName.addValue('New developer' + timestamp);
          let poc = {
            full: 'name' + timestamp,
            email: 'email' + timestamp + '@example.com',
            phone: 'phone' + timestamp,
            website: 'https://website' + timestamp + '.com',
            address: 'address' + timestamp,
            city: 'city' + timestamp,
            state: 'state' + timestamp,
            zip: '11111' + timestamp,
            country: 'country' + timestamp,
          };
          contact.set(poc);
          page.moveDeveloperToSplit(3138);
          actionBar.save();
          expect(page.errors.getText()).toEqual('Developer split involves multiple ONC-ACBs, which requires additional approval. Please contact ONC.');
        });
      });
    });
  });
  describe('when logged in as ONC', () => {
    beforeEach(() => {
      login.logIn('onc');
      login.logoutButton.waitForDisplayed();
    });

    afterEach(() => {
      if (toast.toastContainer.isDisplayed()) {
        toast.clearAllToast();
      }
      login.logOut();
    });

    describe('when on the "Altos Solutions, Inc" Developer page', () => {
      beforeEach(() => {
        let developer = 'Altos Solutions, Inc';
        page = new DevelopersPage();
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
      });

      it('should have merge developer button', () => {
        expect(page.mergeDeveloper.isDisplayed()).toBe(true);
      });

      it('should allow merge to happen', () => {
        page.mergeDeveloper.click();
        page.moveDeveloperToBeMerged('ABH Enterprises, LLC');
        let timestamp = (new Date()).getTime();
        let poc = {
          full: 'name' + timestamp,
          email: 'email' + timestamp + '@example.com',
          phone: 'phone' + timestamp,
        };
        contact.set(poc);
        actionBar.save();
        browser.waitUntil( () =>toast.toastTitle.isDisplayed());
        expect(toast.toastTitle.getText()).toEqual('Merge submitted');
      });
    });
  });
});
