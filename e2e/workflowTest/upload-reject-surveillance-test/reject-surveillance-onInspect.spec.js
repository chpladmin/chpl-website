import UploadSurveillanceComponent from '../../components/upload/upload-surveillance/upload-surveillance.po';
import ConfirmPage from '../../pages/surveillance/confirm/confirm.po';
import LoginComponent from '../../components/login/login.po';
import Hooks from '../../utilities/hooks';
import ToastComponent from '../../components/toast/toast.po';

let confirmPage, hooks, loginComponent, toast, upload;
const listingId = '15.04.04.2988.Heal.PC.01.1.181101';

beforeEach(async () => {
  loginComponent = new LoginComponent();
  confirmPage = new ConfirmPage();
  upload = new UploadSurveillanceComponent();
  hooks = new Hooks();
  toast = new ToastComponent();
  hooks.open('#/surveillance/upload');
  loginComponent.logIn('acb');
  upload.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
  browser.waitUntil( () => toast.toastTitle.isDisplayed());
  toast.clearAllToast();
  hooks.open('#/surveillance/confirm');
  hooks.waitForSpinnerToDisappear();
});

describe('when user rejects a surveillance activity while inspecting uploaded surveillance', () => {

  it('should allow activity to get rejected', () => {
    browser.waitUntil( () => confirmPage.table.isDisplayed());
    var countBefore = confirmPage.tableRowCount.length;
    confirmPage.inspectButton(listingId);
    hooks.waitForSpinnerToDisappear();
    confirmPage.rejectOnInspectButton.click();
    confirmPage.yesConfirmation.click();
    hooks.waitForSpinnerToAppear();
    hooks.waitForSpinnerToDisappear();
    var countAfter = confirmPage.tableRowCount.length;
    expect(countAfter).toBeLessThan(countBefore);
  });
});
