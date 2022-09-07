import UploadSurveillanceComponent from '../../components/upload/upload-surveillance/upload-surveillance.po';
import ConfirmPage from '../../pages/surveillance/confirm/confirm.po';
import LoginComponent from '../../components/login/login.sync.po';
import Hooks from '../../utilities/hooks';
import ToastComponent from '../../components/toast/toast.po';
import SurveillanceEditComponent from '../../components/surveillance/edit/surveillance-edit.po';

let confirmPage; let edit; let hooks; let loginComponent; let toast; let
  upload;
const listingId = '15.04.04.2988.Heal.PC.01.1.181101';
const error1 = 'The requirement \'170.315 (g)(10) (Cures Update)\' is not valid for requirement type \'Certified Capability\'. Valid values are any criterion this product has attested to.';
const error2 = 'Nonconformity type \'170.315 (g)(10) (Cures Update)\' must match either a criterion the surveilled product has attested to or one of the following: \'170.523 (k)(1)\', \'170.523 (k)(2)\', \'170.523 (l)\', or \'Other Non-Conformity\'.';

beforeEach(async () => {
  loginComponent = new LoginComponent();
  toast = new ToastComponent();
  edit = new SurveillanceEditComponent();
  confirmPage = new ConfirmPage();
  upload = new UploadSurveillanceComponent();
  hooks = new Hooks();
  hooks.open('#/surveillance/upload');
  loginComponent.logIn('drummond');
  upload.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
  browser.waitUntil(() => toast.toastTitle.isDisplayed());
  toast.clearAllToast();
  hooks.open('#/surveillance/confirm');
  hooks.waitForSpinnerToDisappear();
});

afterEach(() => {
  if (toast.toastContainer.isDisplayed()) {
    toast.clearAllToast();
  } else if (edit.cancel.isClickable()) {
    edit.cancel.click();
    confirmPage.yesConfirmation.click();
  }
  loginComponent.logOut();
});

describe('when confirming surveillance, ACB', () => {
  it('should be able to confirm surveillance', () => {
    browser.waitUntil(() => confirmPage.table.isDisplayed());
    confirmPage.inspectButton(listingId);
    confirmPage.confirmButton.click();
    confirmPage.yesConfirmation.click();
    hooks.waitForSpinnerToDisappear();
    browser.waitUntil(() => toast.toastTitle.isDisplayed());
    expect(toast.toastTitle.getText()).toBe('Update processing');
  });

  it('should not be able to confirm when the surveillance has a requirement the listing does not attest to', () => {
    browser.waitUntil(() => confirmPage.table.isDisplayed());
    confirmPage.inspectButton(listingId);
    hooks.waitForSpinnerToDisappear();
    edit.editSurveillance();
    edit.addRequirement('Certified Capability', '170.315 (g)(10) (Cures Update): Standardized API for Patient and Population Services', 'No Non-Conformity');
    do {
      edit.saveButton.click();
    } while (!confirmPage.confirmButton.isClickable());
    confirmPage.confirmButton.click();
    confirmPage.yesConfirmation.click();
    browser.waitUntil(() => confirmPage.errorOnConfirm.isDisplayed());
    expect(confirmPage.errorOnConfirm.getText()).toContain(error1);
  });

  it('should not be able to confirm when the surveillance has a non-conformity type the listing does not attest to', () => {
    const nonConformitydetails = {
      type: '170.315 (g)(10) (Cures Update): Standardized API for Patient and Population Services',
      determinationDate: '01/01/2020',
      summary: 'test summary',
      findings: 'test findings',
      approvalDate: '01/01/2020',
      startDate: '01/01/2019',
      completeDate: '01/01/2020',
      explanation: 'Test explanation',
    };
    browser.waitUntil(() => confirmPage.table.isDisplayed());
    confirmPage.inspectButton(listingId);
    hooks.waitForSpinnerToDisappear();
    edit.editSurveillance();
    edit.editRequirement.click();
    edit.addnonConformity(nonConformitydetails, 'Reactive');
    do {
      edit.saveButton.click();
    } while (!confirmPage.confirmButton.isClickable());
    confirmPage.confirmButton.click();
    confirmPage.yesConfirmation.click();
    browser.waitUntil(() => confirmPage.errorOnConfirm.isDisplayed());
    expect(confirmPage.errorOnConfirm.getText()).toContain(error2);
  });
});
