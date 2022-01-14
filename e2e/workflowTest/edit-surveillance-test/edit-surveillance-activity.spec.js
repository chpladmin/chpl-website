import ManagePage from '../../pages/surveillance/manage/manage.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import SurveillanceEditComponent from '../../components/surveillance/edit/surveillance-edit.po';

let hooks;
let login;
let page;
let surveillance;

beforeEach(async () => {
  page = new ManagePage();
  login = new LoginComponent();
  hooks = new Hooks();
  surveillance = new SurveillanceEditComponent();
  await hooks.open('#/surveillance/manage');
});


describe('when logged in as an ACB', () => {
    let listing = '15.04.04.2838.PARA.17.00.1.171228';
    beforeEach(() => {
      login.logIn('drummond');
    });
  
    // afterEach(() => {
    //   login.logOut();
    // });

    it('should not allow to remove non-conformity from a requirement with non-conformity', () => {
      let error = 'End Date is required when there are no open Nonconformities';
        page.search(listing);
        page.clickOnListing(listing);
        page.openListingTab(listing);
        browser.waitUntil (()=> page.initiateSurveillanceButton.isDisplayed())
        let survBefore = page.totalSurveillance();;
        page.initiateSurveillanceButton.click();
        surveillance.startDate.addValue('01/01/2020');
        surveillance.surveillanceType.selectByVisibleText('Reactive');
        surveillance.addRequirement('Certified Capability', '170.315 (a)(2): CPOE - Laboratory', 'No Non-Conformity');
        do {
          surveillance.saveButton.click();
        } while (!surveillance.errorMessages.isDisplayed());
        expect(surveillance.errorMessages.getText()).toContain(error);
        // surveillance.endDate
        // do {
        //     surveillance.saveButton.click();
        // } while (!page.initiateSurveillanceButton.isClickable())
        // hooks.waitForSpinnerToDisappear();
        // let survafter = page.totalSurveillance();
        // expect(survafter).toBe(survBefore + 1);
        // surveillance.editSurveillance.click();
        // browser.pause(5000)
        // surveillance.removeButton.click();
        // const actualErrors= new Set(edit.errorMessages.map((item) => item.getText()));
        // actualErrors.forEach((error) => {
        //   expect(expected.has(error)).toBe(true, `did not find expected error: "${error}"`);
        // });
    });
});
