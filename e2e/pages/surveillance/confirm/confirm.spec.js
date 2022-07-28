import ConfirmPage from './confirm.po';
import UploadSurveillanceComponent from '../../../components/upload/upload-surveillance/upload-surveillance.po';
import LoginComponent from '../../../components/login/login.sync.po';
import Hooks from '../../../utilities/hooks';
import ToastComponent from '../../../components/toast/toast.po';

let confirmPage, hooks, loginComponent, toast, upload;
const rejectListingId1 = '15.04.04.2988.Heal.PC.01.1.181101';
const rejectListingId2 = '15.04.04.1039.Acum.08.00.1.171231';

beforeEach(async () => {
  loginComponent = new LoginComponent();
  confirmPage = new ConfirmPage();
  upload = new UploadSurveillanceComponent();
  hooks = new Hooks();
  toast = new ToastComponent();
  await hooks.open('#/surveillance/upload');
});

describe('when ACB user is on confirm surveillance page', () => {
  beforeEach(() => {
    loginComponent.logIn('drummond');
  });

  afterEach(() => {
    loginComponent.logOut();
  });

  describe('and uploading a surveillance activity', () => {
    beforeEach(() => {
      upload.uploadSurveillance('../../../resources/surveillance/SAQA1.csv');
      browser.waitUntil( () => toast.toastTitle.isDisplayed());
      toast.clearAllToast();
    });

    it('should allow user to reject a surveillance activity', () => {
      hooks.open('#/surveillance/confirm');
      hooks.waitForSpinnerToDisappear();
      confirmPage.rejectCheckbox(rejectListingId1);
      confirmPage.rejectButton.click();
      confirmPage.yesConfirmation.click();
      expect(confirmPage.findSurveillancetoReject(rejectListingId1).isDisplayed()).toBeFalse;
    });
  });

  describe('and uploading multiple surveillance activities', () => {
    beforeEach(() => {
      upload.uploadSurveillance('../../../resources/surveillance/SAQA2.csv');
      browser.waitUntil( () => toast.toastTitle.isDisplayed());
      toast.clearAllToast();
    });

    it('should allow user to mass reject all surveillance activities', () => {
      hooks.open('#/surveillance/confirm');
      hooks.waitForSpinnerToDisappear();
      confirmPage.selectAlltoRejectButton.click();
      confirmPage.rejectButton.waitAndClick();
      confirmPage.yesConfirmation.click();
      expect(confirmPage.findSurveillancetoReject(rejectListingId2).isDisplayed()).toBeFalse;
    });
  });
});
