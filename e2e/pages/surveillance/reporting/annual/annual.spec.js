import ReportingPage from '../reporting.po';
import LoginComponent from '../../../../components/login/login.po';
import Hooks from '../../../../utilities/hooks';
import ToastComponent from '../../../../components/toast/toast.po';
import ActionBarComponent from '../../../../components/action-bar/action-bar.po';
import AnnualPage from './annual.po';

let action; let annualPage; let hooks; let loginComponent; let reportingPage; let toast;

beforeEach(async () => {
  loginComponent = new LoginComponent();
  hooks = new Hooks();
  reportingPage = new ReportingPage();
  toast = new ToastComponent();
  action = new ActionBarComponent();
  annualPage = new AnnualPage();
  await hooks.open('#/surveillance/reporting');
});

describe('when logged in as a ROLE_ONC', () => {
  beforeEach(() => {
    loginComponent.logIn('onc');
    reportingPage.expandAcb('Drummond Group');
    reportingPage.editAnnualReport('Drummond Group', 2019).click();
  });

  afterEach(() => {
    if (toast.toastTitle.isExisting()) {
      toast.clearAllToast();
    }
    loginComponent.logOut();
  });

  it('can only view initiated annual report', () => {
    browser.waitUntil(() => annualPage.obstacleSummary.isDisplayed());
    expect(annualPage.obstacleSummary.isEnabled()).toBe(false);
    expect(annualPage.prioritySummary.isEnabled()).toBe(false);
    expect(action.deleteButton.isDisplayed()).toBe(false);
    expect(action.saveButton.isDisplayed()).toBe(false);
  });

  it('can download annual report', () => {
    annualPage.download.click();
    expect(toast.toastTitle.getText()).toBe('Report is being generated');
  });
});

describe('when logged in as a ROLE_ACB', () => {
  const timestamp = (new Date()).getTime();
  const fields = {
    obstacle: `Obstacle summary ${timestamp}`,
    priority: `Priority summary ${timestamp}`,
  };

  beforeEach(() => {
    loginComponent.logIn('drummond');
    browser.pause(5000);
  });

  afterEach(() => {
    if (toast.toastTitle.isExisting()) {
      toast.clearAllToast();
    }
    loginComponent.logOut();
  });

  xit('can cancel initiating of annual report', () => {
    reportingPage.initiateAnnualReport('Drummond Group', 2022).click();
    action.yes();
    hooks.waitForSpinnerToDisappear();
    action.cancel();
    action.yes();
    hooks.waitForSpinnerToDisappear();
    expect(reportingPage.initiateAnnualReport('Drummond Group', 2022).isExisting()).toBe(true);
  });

  it('can initiate annual report', () => {
    reportingPage.initiateAnnualReport('Drummond Group', 2022).click();
    action.yes();
    browser.waitUntil(() => annualPage.obstacleSummary.isDisplayed());
    annualPage.set(fields);
    action.save();
    browser.waitUntil(() => reportingPage.editAnnualReport('Drummond Group', 2022).isExisting());
    expect(reportingPage.editAnnualReport('Drummond Group', 2022).isExisting()).toBe(true);
  });

  it('can edit annual report', () => {
    const updatedFields = {
      obstacle: `Obstacle summary Updated ${timestamp}`,
      priority: `Priority summary Updated ${timestamp}`,
    };
    reportingPage.editAnnualReport('Drummond Group', 2022).click();
    browser.waitUntil(() => annualPage.obstacleSummary.isDisplayed());
    annualPage.set(updatedFields);
    action.save();
    hooks.waitForSpinnerToDisappear();
    reportingPage.editAnnualReport('Drummond Group', 2022).click();
    expect(annualPage.prioritySummary.getValue()).toBe(updatedFields.priority);
    expect(annualPage.obstacleSummary.getValue()).toBe(updatedFields.obstacle);
  });

  it('can download annual report', () => {
    reportingPage.editAnnualReport('Drummond Group', 2022).click();
    annualPage.download.click();
    expect(toast.toastTitle.getText()).toBe('Report is being generated');
  });

  it('can delete annual report', () => {
    reportingPage.editAnnualReport('Drummond Group', 2022).click();
    action.delete();
    action.yes();
    hooks.waitForSpinnerToDisappear();
    expect(reportingPage.editAnnualReport('Drummond Group', 2022).isExisting()).toBe(false);
  });
});

