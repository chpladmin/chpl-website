import ManagePage from './manage.po';
import LoginComponent from '../../../components/login/login.po';
import Hooks from '../../../utilities/hooks';

let manage,loginComponent,hooks;

describe('on manage surveillance page', () => {
  beforeEach(async () => {
    loginComponent = new LoginComponent();
    manage = new ManagePage();
    hooks = new Hooks();
    await hooks.open('#/surveillance/manage');
  });

  describe('When admin user is logged in', () => {

    beforeEach(() => {
      loginComponent.logIn('admin');
    });

    afterEach(() => {
      loginComponent.logOut();
    });

    it('can view reporting tab', () => {
      hooks.waitForSpinnerToDisappear();
      expect(manage.reportingTab.isDisplayed()).toBe(true);
    });

    describe('When on reporting tab', () => {

      beforeEach(() => {
        manage.reportingTab.click();
      });

      it('should be able to download results based on year and range chosen', () => {
        manage.year.click();
        manage.chooseDropdownValue('2016');
        manage.range.click();
        manage.chooseDropdownValue('q1');
        manage.donwloadResultsButton.click();
        //expecting toast here- add code here
      });
    });
  });

  describe('When ACB user is logged in', () => {
    beforeEach(() => {
      loginComponent.logIn('drummond');
    });
  
    afterEach(() => {
      loginComponent.logOut();
    });
  
    it('should not see reporting tab', () => {
      hooks.waitForSpinnerToDisappear();
      expect(manage.reportingTab.isDisplayed()).toBe(false);
    });
  });
});
