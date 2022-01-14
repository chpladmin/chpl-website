import ManagePage from '../../pages/surveillance/manage/manage.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import SurveillanceEditComponent from '../../components/surveillance/edit/surveillance-edit.po';
import ToastComponent from '../../components/toast/toast.po';

let hooks;
let login;
let page;
let surveillance;
let toast;

beforeEach(async () => {
  page = new ManagePage();
  login = new LoginComponent();
  hooks = new Hooks();
  surveillance = new SurveillanceEditComponent();
  toast= new ToastComponent();
  await hooks.open('#/surveillance/manage');
});


describe('when logged in as an ACB', () => {
    let listing = '15.04.04.2838.PARA.17.00.1.171228';
    beforeEach(() => {
      login.logIn('drummond');
    });
  
    afterEach(() => {
      browser.refresh();  /// it is very complex to exit the opened window based on uiUpgrade flag so temporary adding this
      login.logOut();
    });

    it('should not allow to initiate surveillance without end date when no open non conformity', () => {
        let error = 'End Date is required when there are no open Nonconformities';
        page.search(listing);
        page.clickOnListing(listing);
        page.openListingTab(listing);
        browser.waitUntil (()=> page.initiateSurveillanceButton.isDisplayed())
        page.initiateSurveillanceButton.click();
        surveillance.startDate.addValue('01/01/2020');
        surveillance.surveillanceType.selectByVisibleText('Reactive');
         surveillance.addRequirement('Certified Capability', '170.315 (a)(2): CPOE - Laboratory', 'No Non-Conformity');
        do {
          surveillance.saveButton.click();
        } while (!surveillance.errorMessages.isDisplayed());
        expect(surveillance.errorMessages.getText()).toContain(error);
      });

    it('should be able to initiate surveillance', () => {
        let nonConformitydetails = {
            type: 'Annual Real World Testing Results',
            determinationDate: '01/01/2020',
            summary: 'test summary',
            findings: 'test findings',
            resolution: 'Test resolution',
        };
        page.search(listing);
        page.clickOnListing(listing);
        page.openListingTab(listing);
        browser.waitUntil (()=> page.initiateSurveillanceButton.isDisplayed())
        let survBefore = page.totalSurveillance();;
        page.initiateSurveillanceButton.click();
        surveillance.startDate.addValue('01/01/2020');
        surveillance.surveillanceType.selectByVisibleText('Reactive');
        surveillance.addRequirement('Real World Testing Submission', 'Annual Real World Testing Results', 'Non-Conformity');
        surveillance.addnonConformity(nonConformitydetails , 'Reactive');
        surveillance.saveButton.click();
        surveillance.saveButton.click();
        surveillance.saveButton.click();
        hooks.waitForSpinnerToDisappear();
        browser.waitUntil (()=> toast.toastTitle.isDisplayed())
        toast.clearAllToast();
        let survafter = page.totalSurveillance();
        expect(survafter).toBe(survBefore + 1);
    });
});
