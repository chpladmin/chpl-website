import Hooks from '../../../utilities/hooks';
import ActionBarComponent from '../../../components/action-bar/action-bar.po';
import LoginComponent from '../../../components/login/login.sync.po';
import ToastComponent from '../../../components/toast/toast.po';

import DevelopersPage from './developers.po';

let actionBar;
let hooks;
let login;
let page;
let toast;

describe('the Developers page', () => {
  const timestamp = (new Date()).getTime();
  const website = `https://www.website${timestamp}.com`;
  const developerContact = {
    fullName: `name${timestamp}`,
    title: `title${timestamp}`,
    email: `email.${timestamp}@example.com`,
    phone: `phone${timestamp}`,
  };
  const developerAddress = {
    line1: `address${timestamp}`,
    city: `city${timestamp}`,
    state: `state${timestamp}`,
    zipcode: `11111${timestamp}`,
    country: `country${timestamp}`,
  };

  beforeEach(async () => {
    browser.setWindowSize(1600, 1024); // demo of a bigger screen (esp. useful for screenshots)
    browser.setWindowRect(0, 0, 1600, 1024); // not sure if both are required
    hooks = new Hooks();
    actionBar = new ActionBarComponent();
    login = new LoginComponent();
    toast = new ToastComponent();
    await hooks.open('#/organizations/developers');
  });

  afterEach(() => {
    try {
      actionBar.closeMessages();
    } catch (error) {
      console.log('action bar not open', error);
    }
    if (toast.toastContainer.isDisplayed()) {
      toast.clearAllToast();
    }
    login.logOut();
  });

  describe('when logged in as Drummond ACB', () => {
    beforeEach(() => {
      login.logIn('drummond');
    });

    describe('when on the "Greenway Health, LLC" Developer page', () => {
      beforeEach(() => {
        const developer = 'Greenway Health, LLC';
        page = new DevelopersPage();
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
        page.selectAllCertificationStatus();
      });

      describe('when editing developer information', () => {
        beforeEach(() => {
          page.editDeveloper.click();
        });

        it('should not allow to edit developer status', () => {
          expect(page.developerStatus.isDisplayed()).toBe(false);
        });

        xit('should allow editing of POC', () => {
          page.setContact(developerContact);
          page.editWebsite.setValue(website);
          actionBar.save();
          expect(toast.toastTitle.getText()).toEqual('Update processing');
          toast.clearAllToast();
          hooks.waitForSpinnerToDisappear();
          expect(page.developerContact).toHaveTextContaining(developerContact.full);
          expect(page.developerContact).toHaveTextContaining(developerContact.title);
          expect(page.developerContact).toHaveTextContaining(developerContact.phone);
          expect(page.developerContact).toHaveTextContaining(developerContact.email);
          expect(page.developerWebsite).toHaveTextContaining(website);
        });
      });

      describe('when looking at developer with more than one product', () => {
        it('should have split developer button', () => {
          expect(page.splitDeveloper.isDisplayed()).toBe(true);
        });

        it('should not have join developer button', () => {
          expect(page.joinDeveloper.isDisplayed()).toBe(false);
        });
      });
    });

    xdescribe('when on the "athenahealth, Inc." Developer page which has listings owned by multiple ACBs', () => {
      beforeEach(() => {
        const developer = 'athenahealth, Inc.';
        page = new DevelopersPage();
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
        page.selectAllCertificationStatus();
      });

      it('should show correct error message', () => {
        page.splitDeveloper.click();
        page.developerName.addValue(`New developer${timestamp}`);
        page.editWebsite.setValue(website);
        page.setAddress(developerAddress);
        page.setContact(developerContact);
        page.moveDeveloperToSplit(3138);
        actionBar.save();
        actionBar.waitForMessages();
        expect(actionBar.errors.map((err) => err.getText()).join(';')).toContain('Developer split involves multiple ONC-ACBs, which requires additional approval. Please contact ONC.');
      });
    });
  });

  describe('when logged in as ONC', () => {
    beforeEach(() => {
      login.logIn('onc');
    });

    describe('when on the "Altos Solutions, Inc" Developer page', () => {
      beforeEach(() => {
        const developer = 'Altos Solutions, Inc';
        page = new DevelopersPage();
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
        page.selectAllCertificationStatus();
      });

      it('should have join developer button', () => {
        expect(page.joinDeveloper.isDisplayed()).toBe(true);
      });

      it('should allow join to happen', () => {
        page.joinDeveloper.click();
        page.moveDeveloperToBeJoined('ABH Enterprises, LLC');
        actionBar.save();
        browser.waitUntil(() => toast.toastTitle.isDisplayed());
        expect(toast.toastTitle.getText()).toEqual('Join Developer request submitted');
      });
    });

    xdescribe('when looking at developer with more than one product', () => {
      beforeEach(() => {
        const developer = 'Greenway Health, LLC';
        page = new DevelopersPage();
        page.selectDeveloper(developer);
        page.getDeveloperPageTitle(developer).waitForDisplayed();
        page.selectAllCertificationStatus();
      });

      it('should allow split to happen', () => {
        page.splitDeveloper.click();
        page.developerName.addValue(`New developer${timestamp}`);
        page.editWebsite.setValue(website);
        page.setAddress(developerAddress);
        page.setContact(developerContact);
        page.moveDeveloperToSplit(3526);
        actionBar.save();
        browser.waitUntil(() => toast.toastTitle.isDisplayed());
        expect(toast.toastTitle.getText()).toEqual('Split submitted');
      });
    });
  });
});
