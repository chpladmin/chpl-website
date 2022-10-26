import ManagePage from '../../pages/surveillance/manage/manage.po';
import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';
import SurveillanceEditComponent from '../../components/surveillance/edit/surveillance-edit.po';
import ToastComponent from '../../components/toast/toast.po';
import ActionBarComponent from '../../components/action-bar/action-bar-legacy.po';

let hooks;
let login;
let page;
let surveillance;
let toast;
let action;

beforeEach(async () => {
  page = new ManagePage();
  login = new LoginComponent();
  hooks = new Hooks();
  surveillance = new SurveillanceEditComponent();
  toast = new ToastComponent();
  action = new ActionBarComponent();
  await hooks.open('#/surveillance/manage');
});

describe('On surveillance management page, ROLE_ACB user', () => {
  const listing = '15.04.04.2838.PARA.17.00.1.171228';
  beforeEach(() => {
    login.logIn('drummond');
  });

  afterEach(() => {
    if (surveillance.cancel.isDisplayed()) {
      surveillance.cancel.click();
      action.yes();
    }
    login.logOut();
  });

  it('should not be allowed to initiate surveillance without end date and none open non conformity', () => {
    const error = 'End Date is required when there are no open Nonconformities';
    page.search(listing);
    page.clickOnListing(listing);
    page.openListingTab(listing);
    browser.waitUntil(() => page.initiateSurveillanceButton.isDisplayed());
    browser.saveScreenshot('test_reports/e2e/screenshot/todd.png');
    page.initiateSurveillanceButton.click();
    surveillance.startDate.addValue('01/01/2020');
    surveillance.surveillanceType.selectByVisibleText('Reactive');
    surveillance.addRequirement('Certified Capability', '170.315 (a)(2): CPOE - Laboratory', 'No Non-Conformity');
    do {
      surveillance.saveButton.click();
    } while (!surveillance.errorMessages.isDisplayed());
    expect(surveillance.errorMessages.getText()).toContain(error);
  });

  it('should be able to initiate surveillance with RWT requirement type', () => {
    const nonConformityDetails = {
      type: 'Annual Real World Testing Results',
      determinationDate: '01/01/2020',
      summary: 'test summary',
      findings: 'test findings',
      resolution: 'Test resolution',
    };
    page.search(listing);
    page.clickOnListing(listing);
    page.openListingTab(listing);
    browser.waitUntil(() => page.initiateSurveillanceButton.isDisplayed());
    const survBefore = page.totalSurveillance();
    page.initiateSurveillanceButton.click();
    surveillance.startDate.addValue('01/01/2020');
    surveillance.surveillanceType.selectByVisibleText('Reactive');
    surveillance.addRequirement('Real World Testing Submission', 'Annual Real World Testing Results', 'Non-Conformity');
    surveillance.addnonConformity(nonConformityDetails, 'Reactive');
    surveillance.saveButton.click();
    surveillance.saveButton.click();
    surveillance.saveButton.click();
    browser.waitUntil(() => toast.toastTitle.isDisplayed());
    toast.clearAllToast();
    hooks.waitForSpinnerToDisappear();
    const survAfter = page.totalSurveillance();
    expect(survAfter).toBe(survBefore + 1);
  });

  it('should be able to initiate surveillance with Attestations Submission requirement type', () => {
    const nonConformityDetails = {
      type: 'Semiannual Attestations Submission',
      determinationDate: '01/01/2020',
      summary: 'test summary',
      findings: 'test findings',
      resolution: 'Test resolution',
    };
    page.search(listing);
    page.clickOnListing(listing);
    page.openListingTab(listing);
    browser.waitUntil(() => page.initiateSurveillanceButton.isDisplayed());
    const survBefore = page.totalSurveillance();
    page.initiateSurveillanceButton.click();
    surveillance.startDate.addValue('01/01/2020');
    surveillance.surveillanceType.selectByVisibleText('Reactive');
    surveillance.addRequirement('Attestations Submission', 'Semiannual Attestations Submission', 'Non-Conformity');
    surveillance.addnonConformity(nonConformityDetails, 'Reactive');
    surveillance.saveButton.click();
    surveillance.saveButton.click();
    surveillance.saveButton.click();
    browser.waitUntil(() => toast.toastTitle.isDisplayed());
    toast.clearAllToast();
    hooks.waitForSpinnerToDisappear();
    const survAfter = page.totalSurveillance();
    expect(survAfter).toBe(survBefore + 1);
  });
});

describe('On surveillance management page, ROLE_ADMIN user', () => {
  const listing = '15.07.04.2503.Vers.09.01.1.200210';
  beforeEach(() => {
    login.logIn('admin');
  });

  afterEach(() => {
    if (surveillance.cancel.isDisplayed()) {
      surveillance.cancel.click();
      action.yes();
    }
    login.logOut();
  });

  it('should be able to initiate surveillance with removed criteria requirement', () => {
    page.search(listing);
    page.clickOnListing(listing);
    page.openListingTab(listing);
    browser.waitUntil(() => page.initiateSurveillanceButton.isDisplayed());
    const survBefore = page.totalSurveillance();
    page.initiateSurveillanceButton.click();
    surveillance.startDate.addValue('01/01/2020');
    surveillance.endDate.addValue('05/01/2020');
    surveillance.surveillanceType.selectByVisibleText('Reactive');
    surveillance.addRequirement('Certified Capability', 'Removed | 170.315 (a)(11): Smoking Status', 'No Non-Conformity');
    surveillance.saveButton.click();
    surveillance.saveButton.click();
    browser.waitUntil(() => toast.toastTitle.isDisplayed());
    toast.clearAllToast();
    hooks.waitForSpinnerToDisappear();
    const survAfter = page.totalSurveillance();
    expect(survAfter).toBe(survBefore + 1);
  });
});
