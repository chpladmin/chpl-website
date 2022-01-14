import ManagePage from '../../pages/surveillance/manage/manage.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import SurveillanceEditComponent from '../../components/surveillance/edit/surveillance-edit.po';
import ActionBarComponent from '../../components/action-bar/action-bar.po';
import ToastComponent from '../../components/toast/toast.po';

let hooks;
let login;
let page;
let surveillance;
let action;
let toast;

beforeEach(async () => {
  page = new ManagePage();
  login = new LoginComponent();
  hooks = new Hooks();
  surveillance = new SurveillanceEditComponent();
  action= new ActionBarComponent();
  toast= new ToastComponent();
  await hooks.open('#/surveillance/manage');
});


describe('when logged in as an ACB', () => {
  let listing = '15.04.04.2838.PARA.17.00.1.171228';
  beforeEach(() => {
    login.logIn('drummond');
  });
  
  afterEach(() => {
    login.logOut();
  });

  it('should be able to delete surveillance activity by adding reason', () => {
    page.search(listing);
    page.clickOnListing(listing);
    page.openListingTab(listing);
    browser.waitUntil (()=> page.initiateSurveillanceButton.isDisplayed())
    page.initiateSurveillanceButton.click();
    surveillance.startDate.addValue('01/11/2020');
    surveillance.endDate.addValue('03/11/2020');
    surveillance.surveillanceType.selectByVisibleText('Reactive');
    surveillance.addRequirement('Certified Capability', '170.315 (a)(2): CPOE - Laboratory', 'No Non-Conformity');
    surveillance.saveButton.click();
    surveillance.saveButton.click();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil (()=> toast.toastTitle.isDisplayed())
    toast.clearAllToast();
    let survBefore = page.totalSurveillance();
    $('//*[contains(text(),"Jan 11, 2020")]//parent::a//following-sibling::button').click();
    surveillance.reason.setValue('Delete surveillance');
    surveillance.delete.click();
    action.yes();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil (()=> toast.toastTitle.isDisplayed())
    toast.clearAllToast();
    let survafter = page.totalSurveillance();
    expect(survafter).toEqual(survBefore - 1);
  });
});
