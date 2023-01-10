import ManagePage from '../../pages/surveillance/manage/manage.po';
import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';
import SurveillanceEditComponent from '../../components/surveillance/edit/surveillance-edit.po';
import ToastComponent from '../../components/toast/toast.po';

let hooks;
let login;
let page;
let surveillance;
let toast;
const FIRST_ROW = 1;
const STATUS_COL_IDX = 2;

beforeEach(async () => {
  page = new ManagePage();
  login = new LoginComponent();
  hooks = new Hooks();
  surveillance = new SurveillanceEditComponent();
  toast = new ToastComponent();
  await hooks.open('#/surveillance/manage');
});

describe('On surveillance management page, ROLE_ACB user', () => {
  const listing = '15.04.04.2838.PARA.17.00.1.171228';
  beforeEach(() => {
    login.logIn('drummond');
  });

  afterEach(() => {
    login.logOut();
  });

  it('should be able to close surveillance by adding end date', () => {
    const nonConformitydetails = {
      type: 'Annual Real World Testing Results Reports',
      determinationDate: '01/01/2020',
      summary: 'test summary',
      findings: 'test findings',
      resolution: 'Test resolution',
    };
    page.search(listing);
    page.clickOnListing(listing);
    page.openListingTab(listing);
    browser.waitUntil(() => page.initiateSurveillanceButton.isDisplayed());
    page.initiateSurveillanceButton.click();
    surveillance.startDate.addValue('04/01/2020');
    surveillance.surveillanceType.selectByVisibleText('Reactive');
    surveillance.addRequirement('Real World Testing Submission', 'Annual Real World Testing Results Reports', 'Non-Conformity');
    surveillance.addnonConformity(nonConformitydetails, 'Reactive');
    surveillance.saveButton.click();
    surveillance.saveButton.click();
    surveillance.saveButton.click();
    browser.waitUntil(() => toast.toastTitle.isDisplayed());
    toast.clearAllToast();
    hooks.waitForSpinnerToDisappear();
    page.editSurveillanceActivity('Apr 1, 2020');
    surveillance.endDate.addValue('05/01/2021');
    surveillance.saveButton.click();
    browser.waitUntil(() => toast.toastTitle.isDisplayed());
    toast.clearAllToast();
    hooks.waitForSpinnerToDisappear();
    expect(page.surveillanceActivityInfo('Closed Surveillance, Ended May 1, 2021').isExisting()).toBe(true);
  });

  it('should be able to close surveillance by closing all non conformities', () => {
    const error = 'End Date is required when there are no open Nonconformities';
    const nonConformitydetails = {
      type: 'Annual Real World Testing Results Reports',
      determinationDate: '01/01/2020',
      summary: 'test summary',
      findings: 'test findings',
    };
    page.search(listing);
    page.clickOnListing(listing);
    page.openListingTab(listing);
    browser.waitUntil(() => page.initiateSurveillanceButton.isDisplayed());
    // Initiate surveillance
    page.initiateSurveillanceButton.click();
    surveillance.startDate.addValue('05/01/2020');
    surveillance.surveillanceType.selectByVisibleText('Reactive');
    surveillance.addRequirement('Real World Testing Submission', 'Annual Real World Testing Results Reports', 'Non-Conformity');
    surveillance.addnonConformity(nonConformitydetails, 'Reactive');
    surveillance.saveButton.click();
    surveillance.saveButton.click();
    surveillance.saveButton.click();
    browser.waitUntil(() => toast.toastTitle.isDisplayed());
    toast.clearAllToast();
    hooks.waitForSpinnerToDisappear();
    // Edit surveillance
    page.editSurveillanceActivity('May 1, 2020');
    surveillance.editRequirement.click();
    surveillance.editNonConformity.click();
    surveillance.nonConformityCloseDate.setValue('06/01/2020');
    surveillance.resolution.setValue('Closing NC');
    surveillance.saveButton.click();
    expect(hooks.getCellValue(FIRST_ROW, STATUS_COL_IDX)).toBe('Closed');
    surveillance.saveButton.click();
    surveillance.saveButton.click();
    expect(surveillance.errorMessages.getText()).toContain(error);
    surveillance.endDate.setValue('06/01/2020');
    surveillance.saveButton.click();
    browser.waitUntil(() => toast.toastTitle.isDisplayed());
    toast.clearAllToast();
    hooks.waitForSpinnerToDisappear();
    expect(page.surveillanceActivityInfo('Closed Surveillance, Ended Jun 1, 2020').isExisting()).toBe(true);
  });
});
