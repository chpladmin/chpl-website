import ManagePage from '../../pages/surveillance/manage/manage.po';
import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';
import SurveillanceEditComponent from '../../components/surveillance/edit/surveillance-edit.po';
import ActionBarComponent from '../../components/action-bar/action-bar-legacy.po';
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
  action = new ActionBarComponent();
  toast = new ToastComponent();
  await hooks.open('#/surveillance/manage');
});

//ignoring these quarantined tests as they are flaky and will address this with surveillance react rewrite ticket
xdescribe('On surveillance management page, ROLE_ACB user', () => {
  const listing = '15.04.04.2958.Mill.17.00.0.170411';
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
    browser.waitUntil(() => page.initiateSurveillanceButton.isDisplayed());
    page.initiateSurveillanceButton.click();
    surveillance.startDate.addValue('01/11/2020');
    surveillance.endDate.addValue('03/11/2020');
    surveillance.surveillanceType.selectByVisibleText('Reactive');
    surveillance.addRequirement('Certified Capability', '170.315 (g)(4): Quality Management System', 'No Non-Conformity');
    surveillance.saveButton.click();
    surveillance.saveButton.click();
    browser.waitUntil(() => toast.toastTitle.isDisplayed());
    toast.clearAllToast();
    hooks.waitForSpinnerToDisappear();
    const survBefore = page.totalSurveillance();
    page.editSurveillanceActivity('Mar 11, 2020');
    surveillance.reason.setValue('Delete surveillance');
    surveillance.delete.click();
    action.yes();
    browser.waitUntil(() => toast.toastTitle.isDisplayed());
    toast.clearAllToast();
    hooks.waitForSpinnerToDisappear();
    const survafter = page.totalSurveillance();
    expect(survafter).toEqual(survBefore - 1);
  });
});
